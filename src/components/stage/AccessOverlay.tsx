import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
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
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLParagraphElement>(null)
  const mountedRef = useRef(false)

  useLayoutEffect(() => {
    mountedRef.current = true
    const dialog = dialogRef.current!
    dialog.showModal()
    nameRef.current?.focus()
    return () => {
      mountedRef.current = false
      dialog.close()
    }
  }, [])

  useEffect(() => {
    if (access === 'success') successRef.current?.focus()
  }, [access])

  const update = (key: keyof RequestAccessForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => ({ ...current, [key]: undefined }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (access === 'submitting') return
    const nextErrors = validateRequestAccess(form)
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    dispatch({ type: 'submit-access' })
    try {
      await submitRequestAccess(form)
      if (mountedRef.current) dispatch({ type: 'access-success' })
    } catch {
      if (mountedRef.current) dispatch({ type: 'access-error', message: REQUEST_ACCESS_ERROR })
    }
  }

  const close = () => dispatch({ type: 'close-access' })

  return (
    <dialog
      ref={dialogRef}
      className="access-overlay__dialog"
      aria-labelledby="access-title"
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const rect = event.currentTarget.getBoundingClientRect()
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close()
      }}
    >
      <div className="access-overlay__header">
        <h2 id="access-title">Request a Demo</h2>
        <button type="button" aria-label="Close demo request" onClick={close}>Close</button>
      </div>
      {access === 'success' ? (
        <p ref={successRef} className="access-overlay__success" role="status" tabIndex={-1}>Request received.</p>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          {Object.values(fieldErrors).some(Boolean) ? (
            <p className="access-overlay__error" role="alert">Please correct the highlighted fields.</p>
          ) : null}
            <label htmlFor="access-name">
              Name
              <input
                id="access-name"
                ref={nameRef}
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
            {access === 'error' && accessError ? <p className="access-overlay__error" role="alert">{accessError}</p> : null}
            <button type="submit" disabled={access === 'submitting'}>
              {access === 'submitting' ? 'Sending' : 'Send request'}
            </button>
        </form>
      )}
    </dialog>
  )
}
