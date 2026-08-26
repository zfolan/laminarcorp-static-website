export type RequestAccessForm = {
  name: string
  email: string
  firm: string
}

export type RequestAccessFormErrors = Partial<Record<keyof RequestAccessForm, string>>

export const validateRequestAccess = (form: RequestAccessForm): RequestAccessFormErrors => {
  const errors: RequestAccessFormErrors = {}
  if (!form.name.trim()) errors.name = 'Enter your name.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid work email.'
  if (!form.firm.trim()) errors.firm = 'Enter your firm name.'
  return errors
}

export const REQUEST_ACCESS_ERROR = 'Could not send your request. Try again.'

export const submitRequestAccess = async (form: RequestAccessForm): Promise<void> => {
  const response = await fetch('/api/request-access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name.trim(),
      email: form.email.trim(),
      firm: form.firm.trim(),
    }),
  })
  if (!response.ok) throw new Error(REQUEST_ACCESS_ERROR)
}
