import { request } from './client'

export const login = (payload) => request('/auth/login', {
  method: 'POST',
  body: payload,
})

export const registerEmployee = (payload) => request('/register', {
  method: 'POST',
  body: payload,
})
