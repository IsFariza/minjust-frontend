import React, { useState } from 'react'
import { requestId, statusClass, statusLabel } from '../utils/helpers'

export function RequestTable({ items, owner, onApprove, onReject }) {
    const [rejecting, setRejecting] = useState(null)
    const [reason, setReason] = useState('')

    if (!items.length) {
        return <p className="empty">Заявок пока нет.</p>
    }

    return (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Система</th>
                        <th>ИИН</th>
                        <th>Статус</th>
                        {owner === 'employee' ? <th>Ответ</th> : <th>Действие</th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        const id = requestId(item)
                        const isRejected = String(item.status).toLowerCase() === 'rejected'
                        const isApproved = String(item.status).toLowerCase() === 'approved'

                        return (
                            <tr key={id || `${item.system_name}-${item.employee_iin}`}>
                                <td>{id || '-'}</td>
                                <td>{item.system_name || item.system || '-'}</td>
                                <td>{item.employee_iin || item.iin || '-'}</td>
                                <td><span className={`status ${statusClass(item.status)}`}>{statusLabel(item.status)}</span></td>
                                {owner === 'employee' ? (
                                    <td>
                                        {isApproved && <strong>Первичный пароль: {item.primary_password || item.primaryPassword || 'ожидается'}</strong>}
                                        {isRejected && <span>{item.rejection_reason || item.rejectionReason || 'Причина не указана'}</span>}
                                        {!isApproved && !isRejected && <span className="muted">Ожидает решения модератора</span>}
                                    </td>
                                ) : (
                                    <td>
                                        {String(item.status || 'pending').toLowerCase() === 'pending' ? (
                                            <div className="actions">
                                                <button className="primary small" onClick={() => onApprove(id)} type="button">Одобрить</button>
                                                <button className="danger small" onClick={() => setRejecting(id)} type="button">Отклонить</button>
                                                {rejecting === id && (
                                                    <form
                                                        className="reject-form"
                                                        onSubmit={(event) => {
                                                            event.preventDefault()
                                                            onReject(id, reason)
                                                            setRejecting(null)
                                                            setReason('')
                                                        }}
                                                    >
                                                        <input onChange={(event) => setReason(event.target.value)} placeholder="Причина отказа" required value={reason} />
                                                        <button className="danger small" type="submit">Отправить</button>
                                                    </form>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="muted">Рассмотрено</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}