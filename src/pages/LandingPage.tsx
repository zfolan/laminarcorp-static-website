import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, ClipboardCheck, History, ShieldCheck } from 'lucide-react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Link, useLocation } from 'react-router-dom'
import { ApexDecisionWorkspace, ContextFlow, HeroWorkspace, OutputFlow } from '../components/ProductVisuals'
import { SectionHeading } from '../components/SectionHeading'
import { SiteFooter } from '../components/SiteFooter'
import { landingContent } from '../data/landingContent'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePageMeta } from '../hooks/usePageMeta'

const trustIcons = [ShieldCheck, ClipboardCheck, History]

export const LandingPage = () => {
  const { search } = useLocation()
  const reduceMotion = Boolean(useReducedMotion()) || new URLSearchParams(search).get('motion') === 'reduce'
  const desktop = useMediaQuery('(min-width: 1024px)')
  const heroRef = useRef<HTMLElement>(null)
  const contextRef = useRef<HTMLElement>(null)
  const decisionRef = useRef<HTMLElement>(null)
  const outputRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<0 | 1 | 2>(0)

  usePageMeta({
    title: 'Laminar Apex | Know what needs you next',
    description: landingContent.hero.description,
  })

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroCopyY = useTransform(heroProgress, [0, 0.7], [0, -18])
  const workspaceY = useTransform(heroProgress, [0, 0.72], [72, 0])
  const workspaceOpacity = useTransform(heroProgress, [0, 0.42], [0.62, 1])

  const { scrollYProgress: contextScroll } = useScroll({ target: contextRef, offset: ['start 82%', 'end 35%'] })
  const contextProgress = useTransform(contextScroll, [0.08, 0.82], [0, 1])

  const { scrollYProgress: decisionProgress } = useScroll({ target: decisionRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(decisionProgress, 'change', (value) => {
    if (!desktop || reduceMotion) return
    setPhase(value < 0.3 ? 0 : value < 0.68 ? 1 : 2)
  })

  const { scrollYProgress: outputScroll } = useScroll({ target: outputRef, offset: ['start 85%', 'end 35%'] })
  const outputProgress = useTransform(outputScroll, [0.08, 0.78], [0, 1])

  useEffect(() => {
    if (!desktop || reduceMotion) setPhase(2)
  }, [desktop, reduceMotion])

  return (
    <>
      <section ref={heroRef} className="hero" aria-labelledby="hero-title">
        <div className="hero__glow" aria-hidden="true" />
        <motion.div className="hero__copy" style={reduceMotion ? undefined : { y: heroCopyY }}>
          <p className="eyebrow">{landingContent.hero.eyebrow}</p>
          <h1 id="hero-title">{landingContent.hero.title}</h1>
          <p className="hero__description">{landingContent.hero.description}</p>
          <div className="hero__actions">
            <Link className="button" to="/request-access">Request access <ArrowRight size={16} /></Link>
            <a className="text-link" href="#platform">See the decision flow <ArrowDown size={15} /></a>
          </div>
        </motion.div>
        <div className="hero__scroll-cue" aria-hidden="true"><span>SCROLL TO RESOLVE</span><i><b /></i></div>
        <HeroWorkspace y={reduceMotion ? undefined : workspaceY} opacity={reduceMotion ? undefined : workspaceOpacity} />
      </section>

      <section ref={contextRef} id="platform" className="chapter context-chapter" aria-labelledby="context-title">
        <div className="page-width"><SectionHeading titleId="context-title" eyebrow={landingContent.context.eyebrow} title={landingContent.context.title} description={landingContent.context.description} /></div>
        <ContextFlow progress={contextProgress} reduced={reduceMotion} />
      </section>

      <section ref={decisionRef} className={`decision-scroll ${desktop && !reduceMotion ? 'is-cinematic' : 'is-linear'}`} aria-labelledby="decision-title">
        {desktop && !reduceMotion ? (
          <div className="decision-sticky">
            <div className="page-width decision-sticky__content">
              <SectionHeading titleId="decision-title" eyebrow={landingContent.decision.eyebrow} title={landingContent.decision.title} description={landingContent.decision.description} />
              <div className="decision-progress" aria-hidden="true"><span>STICKY STAGE<br />03 VIEWPORTS</span><i><motion.b style={{ scaleY: decisionProgress }} /></i></div>
              <div className="decision-workspace" aria-hidden="true"><ApexDecisionWorkspace phase={phase} /></div>
            </div>
          </div>
        ) : (
          <div className="page-width decision-linear">
            <SectionHeading titleId="decision-title" eyebrow={landingContent.decision.eyebrow} title={landingContent.decision.title} description={landingContent.decision.description} />
            {[0, 1, 2].map((item) => <div className="decision-linear__step" key={item} aria-hidden="true"><span className="data-label data-label--blue">0{item + 1} / {['PRIORITIZE', 'REVIEW', 'APPROVE'][item]}</span><ApexDecisionWorkspace phase={item as 0 | 1 | 2} /></div>)}
          </div>
        )}
      </section>

      <section ref={outputRef} className="chapter output-chapter" aria-labelledby="output-title">
        <div className="page-width"><SectionHeading titleId="output-title" eyebrow={landingContent.output.eyebrow} title={landingContent.output.title} description={landingContent.output.description} /><OutputFlow progress={outputProgress} reduced={reduceMotion} /></div>
      </section>

      <section id="security" className="trust-section" aria-labelledby="trust-title">
        <div className="page-width">
          <p className="eyebrow">CONTROL / WITHOUT THE CLAIMS THEATRE</p>
          <h2 id="trust-title">Operational clarity is part of the product.</h2>
          <div className="trust-grid">
            {landingContent.trust.map((item, index) => {
              const Icon = trustIcons[index]
              return <article key={item.title}><Icon size={18} /><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>
            })}
          </div>
        </div>
      </section>

      <section id="company" className="company-section" aria-labelledby="company-title">
        <div className="company-section__inner">
          <p className="eyebrow">FROM THE FIRST SIGNAL TO THE CLIENT CONVERSATION</p>
          <h2 id="company-title">Built for teams carrying professional judgment through complex portfolio workflows.</h2>
          <p>Laminar Apex supports advisors, portfolio managers, investment teams, and firm leaders without replacing oversight.</p>
          <Link className="button" to="/request-access">Request access <ArrowUpRight size={16} /></Link>
        </div>
        <SiteFooter />
      </section>
    </>
  )
}
