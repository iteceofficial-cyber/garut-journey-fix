/**
 * Netlify Forms helpers. Forms are registered at build time by the static
 * skeleton in public/__forms.html — keep its field names in sync.
 */
export async function submitNetlifyForm(formName: string, data: Record<string, string>) {
  const body = new URLSearchParams({ 'form-name': formName, ...data }).toString()
  const res = await fetch('/__forms.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`Form submission failed (${res.status})`)
}

export function formToObject(form: HTMLFormElement) {
  const out: Record<string, string> = {}
  new FormData(form).forEach((v, k) => {
    out[k] = String(v)
  })
  return out
}
