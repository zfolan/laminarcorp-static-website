import type { RequestAccessFormData } from '../types/content'

export type RequestAccessFormErrors = Partial<Record<keyof RequestAccessFormData, string>>

export const validateRequestAccess = (form: RequestAccessFormData): RequestAccessFormErrors => {
  const errors: RequestAccessFormErrors = {}
  if (!form.name.trim()) errors.name = 'Enter your name.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid work email.'
  if (!form.firm.trim()) errors.firm = 'Enter your firm name.'
  if (!form.role) errors.role = 'Select your role.'
  return errors
}
