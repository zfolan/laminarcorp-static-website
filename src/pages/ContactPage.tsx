import { useState, type FormEvent } from 'react'
import { DemoServiceNotConfiguredError, submitDemoRequest, type DemoRequest } from '../services/demoRequest'
import { usePageMeta } from '../hooks/usePageMeta'

type Errors = Partial<Record<keyof DemoRequest, string>>

const initialForm: DemoRequest = { name: '', email: '', firm: '', role: '', teamSize: '', households: '', workflow: '' }

const validate = (form: DemoRequest) => {
  const errors: Errors = {}
  if (!form.name.trim()) errors.name = 'Enter your name.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid work email.'
  if (!form.firm.trim()) errors.firm = 'Enter your firm name.'
  if (!form.role) errors.role = 'Select your role.'
  if (!form.workflow.trim()) errors.workflow = 'Tell us what you would like to improve.'
  return errors
}

export const ContactPage = () => {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  usePageMeta({ title: 'Book a Laminar demo', description: 'Book a focused demonstration of Laminar household analysis, portfolio management, and implementation capabilities.' })

  const update = (key: keyof DemoRequest, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setState('error')
      setMessage('Review the highlighted fields and try again.')
      return
    }
    setState('sending')
    setMessage('')
    try {
      await submitDemoRequest(form)
      setState('success')
      setMessage('Your demo request has been sent. The Laminar team will follow up with you.')
      setForm(initialForm)
    } catch (error) {
      setState('error')
      setMessage(error instanceof DemoServiceNotConfiguredError ? 'Your request has not been sent. Demo delivery is not connected on this preview site.' : error instanceof Error ? error.message : 'The request could not be sent. Please try again later.')
    }
  }

  return (
    <section className="contact-page">
      <div className="contact-intro">
        <div><p className="eyebrow">BOOK A FOCUSED DEMONSTRATION</p><h1>See Laminar in your portfolio workflow.</h1></div>
        <div><p>Book a focused demonstration of Laminar’s household analysis, portfolio-management, and implementation capabilities.</p><dl><div><dt>01</dt><dd>Share how your team manages portfolios today.</dd></div><div><dt>02</dt><dd>See the household analysis and review workflow.</dd></div><div><dt>03</dt><dd>Discuss fit, questions, and next steps.</dd></div></dl></div>
      </div>
      <div className="contact-form-wrap">
        <form className="demo-form" onSubmit={onSubmit} noValidate aria-describedby="form-context">
          <div className="form-heading"><span>DEMO REQUEST</span><span>ALL REQUIRED FIELDS ARE LABELLED</span></div>
          <div className="form-grid">
            <label>Name <span aria-hidden="true">*</span><input aria-label="Name" autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</label>
            <label>Work email <span aria-hidden="true">*</span><input aria-label="Work email" type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <small id="email-error" className="field-error">{errors.email}</small>}</label>
            <label>Firm <span aria-hidden="true">*</span><input aria-label="Firm" autoComplete="organization" value={form.firm} onChange={(event) => update('firm', event.target.value)} aria-invalid={Boolean(errors.firm)} aria-describedby={errors.firm ? 'firm-error' : undefined} />{errors.firm && <small id="firm-error" className="field-error">{errors.firm}</small>}</label>
            <label>Role <span aria-hidden="true">*</span><select aria-label="Role" value={form.role} onChange={(event) => update('role', event.target.value)} aria-invalid={Boolean(errors.role)} aria-describedby={errors.role ? 'role-error' : undefined}><option value="">Select your role</option><option>Financial advisor</option><option>Portfolio manager</option><option>Investment team</option><option>Operations leader</option><option>Firm executive</option><option>Other</option></select>{errors.role && <small id="role-error" className="field-error">{errors.role}</small>}</label>
            <label>Approximate number of advisors or portfolio managers<select value={form.teamSize} onChange={(event) => update('teamSize', event.target.value)}><option value="">Select a range</option><option>1–5</option><option>6–20</option><option>21–50</option><option>51–100</option><option>More than 100</option></select></label>
            <label>Approximate number of households<select value={form.households} onChange={(event) => update('households', event.target.value)}><option value="">Select a range</option><option>Fewer than 250</option><option>250–1,000</option><option>1,001–5,000</option><option>More than 5,000</option><option>Prefer not to say</option></select></label>
            <label className="form-full">What would you like to improve about your current portfolio workflow? <span aria-hidden="true">*</span><textarea aria-label="What would you like to improve about your current portfolio workflow?" rows={6} value={form.workflow} onChange={(event) => update('workflow', event.target.value)} aria-invalid={Boolean(errors.workflow)} aria-describedby={errors.workflow ? 'workflow-error' : undefined} placeholder="For example: household-level rebalancing, exception review, or coordinating implementation across accounts." />{errors.workflow && <small id="workflow-error" className="field-error">{errors.workflow}</small>}</label>
          </div>
          <div className="form-submit"><p id="form-context">The form service is isolated for connection to your approved CRM or scheduling workflow. No request is recorded unless the configured service confirms receipt.</p><button className="button button--primary" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Book Demo'} <span aria-hidden="true">↗</span></button></div>
          {message && <div className={`form-status form-status--${state}`} role={state === 'error' ? 'alert' : 'status'}>{message}</div>}
        </form>
        <aside className="contact-aside"><span>WHAT WE’LL FOCUS ON</span><ul><li>How accounts are assessed as one household portfolio</li><li>How drift, risk, cash, currency, and restrictions enter the review</li><li>How proposed changes resolve into account-level recommendations</li><li>How portfolio managers review exceptions and retain control</li></ul><p>Product capabilities shown during the demonstration should be confirmed against the current release.</p></aside>
      </div>
    </section>
  )
}
