import { request } from './client'

export const getEmployeeProfile = (token) => request('/employee/profile', { token })

export const getHandbook = () => request('/handbook')
