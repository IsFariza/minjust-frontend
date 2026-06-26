import { request } from './client'

export const createPasswordRequest = (token, payload) => request('/password-requests', {
  method: 'POST',
  token,
  body: payload,
})

export const getMyRequests = (token) => request('/password-requests/my', { token })

export const getAllRequests = (token) => request('/admin/password-requests/all', { token })

export const reviewRequest = (token, requestId, payload) => request(`/admin/password-requests/${requestId}/review`, {
  method: 'PUT',
  token,
  body: payload,
})
