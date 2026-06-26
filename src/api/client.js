import { API_BASE_URL } from '../utils/constants'

const readError = async (response) => {
  const text = await response.text()

  if (!text) {
    return 'Сервер вернул ошибку'
  }

  try {
    const parsed = JSON.parse(text)
    return parsed.message || parsed.error || parsed.detail || text
  } catch {
    return text
  }
}

export const request = async (path, options = {}) => {
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}
