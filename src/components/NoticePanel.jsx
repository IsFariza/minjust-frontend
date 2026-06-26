import React, { useState } from 'react'
import { DEFAULT_NOTICE } from '../utils/constants'

export function NoticePanel({ role }) {
    const [notice, setNotice] = useState(() => {
        const saved = localStorage.getItem('minjust-notice')
        return saved ? JSON.parse(saved) : DEFAULT_NOTICE
    })
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(notice)

    const save = () => {
        setNotice(draft)
        localStorage.setItem('minjust-notice', JSON.stringify(draft))
        setEditing(false)
    }

    return (
        <section className="notice-panel">
            {editing ? (
                <div className="notice-editor">
                    <input onChange={(event) => setDraft({ ...draft, birthday: event.target.value })} value={draft.birthday} />
                    <input onChange={(event) => setDraft({ ...draft, news: event.target.value })} value={draft.news} />
                    <button className="primary small" onClick={save} type="button">Сохранить</button>
                </div>
            ) : (
                <>
                    <p>{notice.birthday}</p>
                    <p>{notice.news}</p>
                    {role === 'admin' && <button className="secondary small" onClick={() => setEditing(true)} type="button">Редактировать</button>}
                </>
            )}
        </section>
    )
}