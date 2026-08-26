import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SiteFooter } from '../components/SiteFooter'
import { usePageMeta } from '../hooks/usePageMeta'
import { validateRequestAccess, type RequestAccessFormErrors } from '../lib/requestAccess'
import type { RequestAccessFormData } from '../types/content'

const initialForm: RequestAccessFormData = { name: '', email: '', firm: '', role: '', workflow: '' }

export const RequestAccessPage = () => {
  const [form, setForm] = useState<RequestAccessFormData>(initialForm)
  const [errors, setErrors] = useState<RequestAccessFormErrors>({})
  const [validated, setValidated] = useState(false)

  usePageMeta({
    title: 'Request access | Laminar Apex',
    description: 'Request access to Laminar Apex and tell us how your team manages portfolio decisions today.',
  })

  const update = (key: keyof RequestAccessFormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateRequestAccess(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setValidated(false)
      return
    }
    setForm(initialForm)
    setValidated(true)
  }

  const reset = () => {
    setForm(initialForm)
    setErrors({})
    setValidated(false)
  }

  return (
    <div className="request-page">
      <div className="request-page__intro">
        <Link className="back-link" to="/"><ArrowLeft size={15} /> Back to Apex</Link>
        <p className="eyebrow">REQUEST ACCESS / PRODUCT PREVIEW</p>
        <h1>See how Apex fits your decision workflow.</h1>
        <p>Tell us a little about your team. This prototype validates the form experience, but it does not send or store your information.</p>
        <dl>
          <div><dt>01</dt><dd>Share how your team works today.</dd></div>
          <div><dt>02</dt><dd>Review the connected decision workflow.</dd></div>
          <div><dt>03</dt><dd>Discuss fit, controls, and next steps.</dd></div>
        </dl>
      </div>
      <div className="request-page__form-wrap">
        {validated ? (
          <section className="form-success" aria-live="polite">
            <CheckCircle2 size={28} />
            <p className="eyebrow">FORM VALIDATED</p>
            <h2>Submission delivery will be connected before launch.</h2>
            <p>No information was sent or stored. The form is ready for its future delivery service.</p>
            <button className="button button--secondary" type="button" onClick={reset}>Start again <ArrowRight size={15} /></button>
          </section>
        ) : (
          <form className="request-form" onSubmit={onSubmit} noValidate>
            <div className="request-form__heading"><span>ACCESS REQUEST</span><span>PROTOTYPE / NO DELIVERY</span></div>
            <div className="form-grid">
              <label htmlFor="name">Name <span aria-hidden="true">*</span>
                <input id="name" autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
                {errors.name && <small id="name-error">{errors.name}</small>}
              </label>
              <label htmlFor="email">Work email <span aria-hidden="true">*</span>
                <input id="email" type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
                {errors.email && <small id="email-error">{errors.email}</small>}
              </label>
              <label htmlFor="firm">Firm <span aria-hidden="true">*</span>
                <input id="firm" autoComplete="organization" value={form.firm} onChange={(event) => update('firm', event.target.value)} aria-invalid={Boolean(errors.firm)} aria-describedby={errors.firm ? 'firm-error' : undefined} />
                {errors.firm && <small id="firm-error">{errors.firm}</small>}
              </label>
              <label htmlFor="role">Role <span aria-hidden="true">*</span>
                <select id="role" value={form.role} onChange={(event) => update('role', event.target.value)} aria-invalid={Boolean(errors.role)} aria-describedby={errors.role ? 'role-error' : undefined}>
                  <option value="">Select your role</option>
                  <option value="advisor">Advisor</option>
                  <option value="portfolio-manager">Portfolio manager</option>
                  <option value="investment-operations">Investment / operations leader</option>
                  <option value="firm-executive">Firm executive</option>
                  <option value="other">Other</option>
                </select>
                {errors.role && <small id="role-error">{errors.role}</small>}
              </label>
              <label className="form-grid__full" htmlFor="workflow">What would you like to improve? <span>Optional</span>
                <textarea id="workflow" rows={6} value={form.workflow} onChange={(event) => update('workflow', event.target.value)} placeholder="For example: prioritizing exceptions or carrying approvals into client conversations." />
              </label>
            </div>
            <div className="request-form__submit">
              <p>Your information remains in this browser only until validation, then it is cleared.</p>
              <button className="button" type="submit">Validate request <ArrowRight size={15} /></button>
            </div>
          </form>
        )}
      </div>
      <SiteFooter />
    </div>
  )
}
