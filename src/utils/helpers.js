export const extractToken = (data) => data?.token || data?.access_token || data?.jwt || data?.accessToken || ''
export const asArray = (data) => Array.isArray(data) ? data : data?.items || data?.data || data?.content || []
export const requestId = (item) => item?.id || item?.request_id || item?.password_request_id
export const employeeIin = (profile) => profile?.iin || profile?.employee_iin || profile?.username || ''

export const statusLabel = (status) => {
    const normalized = String(status || 'pending').toLowerCase()
    if (normalized === 'approved') return 'Одобрено'
    if (normalized === 'rejected') return 'Отклонено'
    return 'На рассмотрении'
}

export const statusClass = (status) => {
    const normalized = String(status || 'pending').toLowerCase()
    if (normalized === 'approved') return 'approved'
    if (normalized === 'rejected') return 'rejected'
    return 'pending'
}