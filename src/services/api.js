const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const apiRequest = async (path, options = {}) => {
  const headers = new Headers(options.headers || {})

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const token = localStorage.getItem('authToken')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    })
  } catch (error) {
    throw new Error(
      `Cannot reach the backend at ${API_BASE_URL}. Start the backend with "npm start" from the backend folder. If it reports ".env not found", copy .env.example to .env and enter your local MySQL settings.`,
      {
      cause: error
      }
    )
  }

  let result
  try {
    result = await response.json()
  } catch {
    throw new Error('The server returned an invalid response')
  }

  if (!response.ok) {
    throw new Error(result.message || 'The request failed')
  }

  return result
}

export const saveAuthentication = ({ customer, token }) => {
  localStorage.setItem('authToken', token)
  localStorage.setItem('user', JSON.stringify(customer))
}
