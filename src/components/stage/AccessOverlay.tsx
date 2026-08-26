import { useState, type FormEvent } from 'react'
import { REQUEST_ACCESS_ERROR, submitRequestAccess, validateRequestAccess, type RequestAccessForm, type RequestAccessFormErrors } from '../../lib/requestAccess'
import type { StageAction } from '../../lib/stageState'
import type { AccessStatus } from '../../types/stage'

const emptyForm: RequestAccessForm = { name: '', email: '', firm: '' }

type Props = {
  access: AccessStatus
  accessError: string | null
  dispatch: (action: StageAction) => void
}

export const AccessOverlay = ({ access, accessError, dispatch }: Props) => {
  const [form, setForm] = useState<RequestAccessForm>(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<RequestAccessFormErrors>({})

  const update = (key: keyof RequestAccessForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => ({ ...current, [key]: undefined }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateRequestAccess(form)
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    dispatch({ type: 'submit-access' })
    try {
      await submitRequestAccess(form)
      dispatch({ type: 'access-success' })
    } catch {
      dispatch({ type: 'access-error', message: REQUEST_ACCESS_ERROR })
    }
  }

  const close = () => dispatch({ type: 'close-access' })

  return (
    <div className="access-overlay">
      <button type="button" className="access-overlay__backdrop" aria-label="Close request access" onClick={close} />
      <div className="access-overlay__dialog" role="dialog" aria-modal="true" aria-labelledby="access-title">
        <h2 id="access-title">Request access</h2>
        {access === 'success' ? (
          <div>
            <p>Request received.</p>
            <button type="button" onClick={close}>Close</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="access-name">
              Name
              <input
                id="access-name"
                autoComplete="name"
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'access-name-error' : undefined}
              />
              {fieldErrors.name ? <small id="access-name-error">{fieldErrors.name}</small> : null}
            </label>
            <label htmlFor="access-firm">
              Firm
              <input
                id="access-firm"
                autoComplete="organization"
                value={form.firm}
                onChange={(event) => update('firm', event.target.value)}
                aria-invalid={Boolean(fieldErrors.firm)}
                aria-describedby={fieldErrors.firm ? 'access-firm-error' : undefined}
              />
              {fieldErrors.firm ? <small id="access-firm-error">{fieldErrors.firm}</small> : null}
            </label>
            <label htmlFor="access-email">
              Email
              <input
                id="access-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'access-email-error' : undefined}
              />
              {fieldErrors.email ? <small id="access-email-error">{fieldErrors.email}</small> : null}
            </label>
            {access === 'error' && accessError ? <p className="access-overlay__error">{accessError}</p> : null}
            <button type="submit" disabled={access === 'submitting'}>
              {access === 'submitting' ? 'Sending' : 'Send request'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
