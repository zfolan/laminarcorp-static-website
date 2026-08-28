export const isSoftwareRenderer = (name: string) =>
  /swiftshader|llvmpipe|softpipe|microsoft basic render|cpu rasterizer|mesa offscreen/i.test(name)

const GL_ATTRS: WebGLContextAttributes = {
  alpha: false,
  antialias: true,
  failIfMajorPerformanceCaveat: true,
  premultipliedAlpha: true,
}

const POINT_VS = `
attribute vec2 a_pos;
attribute float a_size;
attribute vec4 a_color;
uniform vec2 u_view;
uniform vec2 u_cam;
varying vec4 v_color;
void main() {
  vec2 p = (a_pos - u_cam) / u_view * 2.0 - 1.0;
  p.y = -p.y;
  gl_Position = vec4(p, 0.0, 1.0);
  gl_PointSize = max(a_size * 2.0, 1.0);
  v_color = a_color;
}
`

const POINT_FS = `
precision mediump float;
varying vec4 v_color;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  if (dot(c, c) > 0.25) discard;
  gl_FragColor = v_color;
}
`

const LINE_VS = `
attribute vec2 a_pos;
attribute vec4 a_color;
uniform vec2 u_view;
uniform vec2 u_cam;
varying vec4 v_color;
void main() {
  vec2 p = (a_pos - u_cam) / u_view * 2.0 - 1.0;
  p.y = -p.y;
  gl_Position = vec4(p, 0.0, 1.0);
  v_color = a_color;
}
`

const LINE_FS = `
precision mediump float;
varying vec4 v_color;
void main() {
  gl_FragColor = v_color;
}
`

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

const programOf = (gl: WebGLRenderingContext, vsSrc: string, fsSrc: string) => {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc)
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc)
  if (!vs || !fs) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  return program
}

const softwareGl = (gl: WebGLRenderingContext) => {
  const ext = gl.getExtension('WEBGL_debug_renderer_info')
  if (!ext) return false
  const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '')
  return isSoftwareRenderer(renderer)
}

export type AetherGpu = {
  begin: (viewW: number, viewH: number, camX: number, camY: number) => void
  dot: (x: number, y: number, size: number, r: number, g: number, b: number, a: number) => void
  line: (x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, a: number, width: number) => void
  flush: () => void
}

const MAX_DOTS = 4096
const MAX_LINE_VERTS = 4096 * 6

export const tryAetherGpu = (canvas: HTMLCanvasElement): AetherGpu | null => {
  const probe = document.createElement('canvas')
  const probeGl = (probe.getContext('webgl2', GL_ATTRS) || probe.getContext('webgl', GL_ATTRS)) as WebGLRenderingContext | null
  if (!probeGl || typeof probeGl.createShader !== 'function' || softwareGl(probeGl)) return null

  const gl = (canvas.getContext('webgl2', GL_ATTRS) || canvas.getContext('webgl', GL_ATTRS)) as WebGLRenderingContext | null
  if (!gl || typeof gl.createShader !== 'function' || softwareGl(gl)) return null

  const pointProg = programOf(gl, POINT_VS, POINT_FS)
  const lineProg = programOf(gl, LINE_VS, LINE_FS)
  if (!pointProg || !lineProg) return null

  const pointBuf = gl.createBuffer()
  const lineBuf = gl.createBuffer()
  if (!pointBuf || !lineBuf) return null

  const pPos = gl.getAttribLocation(pointProg, 'a_pos')
  const pSize = gl.getAttribLocation(pointProg, 'a_size')
  const pColor = gl.getAttribLocation(pointProg, 'a_color')
  const pView = gl.getUniformLocation(pointProg, 'u_view')
  const pCam = gl.getUniformLocation(pointProg, 'u_cam')

  const lPos = gl.getAttribLocation(lineProg, 'a_pos')
  const lColor = gl.getAttribLocation(lineProg, 'a_color')
  const lView = gl.getUniformLocation(lineProg, 'u_view')
  const lCam = gl.getUniformLocation(lineProg, 'u_cam')

  const dots = new Float32Array(MAX_DOTS * 7)
  const lines = new Float32Array(MAX_LINE_VERTS * 6)
  let dotN = 0
  let lineN = 0
  let viewW = 1
  let viewH = 1
  let camX = 0
  let camY = 0

  const pushLineVert = (x: number, y: number, r: number, g: number, b: number, a: number) => {
    if (lineN >= MAX_LINE_VERTS) return
    const o = lineN * 6
    lines[o] = x
    lines[o + 1] = y
    lines[o + 2] = r
    lines[o + 3] = g
    lines[o + 4] = b
    lines[o + 5] = a
    lineN += 1
  }

  return {
    begin(nextW, nextH, nextCamX, nextCamY) {
      viewW = Math.max(1, nextW)
      viewH = Math.max(1, nextH)
      camX = nextCamX
      camY = nextCamY
      dotN = 0
      lineN = 0
    },
    dot(x, y, size, r, g, b, a) {
      if (dotN >= MAX_DOTS) return
      const o = dotN * 7
      dots[o] = x
      dots[o + 1] = y
      dots[o + 2] = size
      dots[o + 3] = r
      dots[o + 4] = g
      dots[o + 5] = b
      dots[o + 6] = a
      dotN += 1
    },
    line(x1, y1, x2, y2, r, g, b, a, width) {
      const dx = x2 - x1
      const dy = y2 - y1
      const len = Math.hypot(dx, dy) || 1
      const hw = Math.max(width, 1) * 0.5
      const nx = (-dy / len) * hw
      const ny = (dx / len) * hw
      pushLineVert(x1 + nx, y1 + ny, r, g, b, a)
      pushLineVert(x1 - nx, y1 - ny, r, g, b, a)
      pushLineVert(x2 + nx, y2 + ny, r, g, b, a)
      pushLineVert(x1 - nx, y1 - ny, r, g, b, a)
      pushLineVert(x2 - nx, y2 - ny, r, g, b, a)
      pushLineVert(x2 + nx, y2 + ny, r, g, b, a)
    },
    flush() {
      gl.viewport(0, 0, viewW, viewH)
      gl.clearColor(7 / 255, 9 / 255, 13 / 255, 1)
      gl.disable(gl.DEPTH_TEST)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.clear(gl.COLOR_BUFFER_BIT)

      if (dotN) {
        gl.useProgram(pointProg)
        gl.uniform2f(pView, viewW, viewH)
        gl.uniform2f(pCam, camX, camY)
        gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf)
        gl.bufferData(gl.ARRAY_BUFFER, dots.subarray(0, dotN * 7), gl.DYNAMIC_DRAW)
        gl.enableVertexAttribArray(pPos)
        gl.vertexAttribPointer(pPos, 2, gl.FLOAT, false, 28, 0)
        gl.enableVertexAttribArray(pSize)
        gl.vertexAttribPointer(pSize, 1, gl.FLOAT, false, 28, 8)
        gl.enableVertexAttribArray(pColor)
        gl.vertexAttribPointer(pColor, 4, gl.FLOAT, false, 28, 12)
        gl.drawArrays(gl.POINTS, 0, dotN)
      }

      if (lineN) {
        gl.useProgram(lineProg)
        gl.uniform2f(lView, viewW, viewH)
        gl.uniform2f(lCam, camX, camY)
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf)
        gl.bufferData(gl.ARRAY_BUFFER, lines.subarray(0, lineN * 6), gl.DYNAMIC_DRAW)
        gl.enableVertexAttribArray(lPos)
        gl.vertexAttribPointer(lPos, 2, gl.FLOAT, false, 24, 0)
        gl.enableVertexAttribArray(lColor)
        gl.vertexAttribPointer(lColor, 4, gl.FLOAT, false, 24, 8)
        gl.drawArrays(gl.TRIANGLES, 0, lineN)
      }
    },
  }
}
