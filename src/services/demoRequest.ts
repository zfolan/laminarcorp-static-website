export type DemoRequest = {
  name: string
  email: string
  firm: string
  role: string
  teamSize: string
  households: string
  workflow: string
}

export class DemoServiceNotConfiguredError extends Error {
  constructor() {
    super('The demo-request service is not connected yet.')
  }
}

export const submitDemoRequest = async (request: DemoRequest) => {
  const endpoint = import.meta.env.VITE_DEMO_REQUEST_ENDPOINT
  if (!endpoint) throw new DemoServiceNotConfiguredError()

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) throw new Error('The request could not be sent. Please review the form or try again later.')
}
