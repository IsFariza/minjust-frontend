import React, { useState } from 'react'
import { SYSTEMS } from '../utils/constants'
import { employeeIin } from '../utils/helpers'

export function ResetPasswordPanel({ profile, onCreated }) {
    const [selected, setSelected] = useState('')
    const [iin, setIin] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const submit = async (event) => {
        event.preventDefault()
        setError('')
        setMessage('')

        if (iin !== employeeIin(profile)) {
            setError('ИИН должен совпадать с ИИН текущего пользователя.')
            return
        }

        setLoading(true)
        try {
            await onCreated(selected, iin)
            setMessage('Заявка отправлена модератору.')
            setIin('')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="system-panel">
            <h2>Выберите систему для сброса пароля:</h2>
            <div className="system-list">
                {SYSTEMS.map((system) => (
                    <button className={selected === system ? 'selected' : ''} key={system} onClick={() => setSelected(system)} type="button">
                        {system}
                    </button>
                ))}
            </div>
            {selected && (
                <form className="iin-form" onSubmit={submit}>
                    <label>
                        Подтвердите ИИН
                        <input onChange={(event) => setIin(event.target.value)} required value={iin} />
                    </label>
                    {message && <p className="form-success">{message}</p>}
                    {error && <p className="form-error">{error}</p>}
                    <button className="primary small" disabled={loading} type="submit">{loading ? 'Отправка...' : 'Подтвердить'}</button>
                </form>
            )}
        </section>
    )
}