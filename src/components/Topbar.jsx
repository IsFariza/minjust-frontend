import React from 'react'

export function Topbar({ page, role, onNavigate, onLogout }) {
    return (
        <header className="topbar">
            <button className="brand" onClick={() => onNavigate('home')} type="button">MINJUST.KZ</button>
            <nav>
                <button className={page === 'home' ? 'active' : ''} onClick={() => onNavigate('home')} type="button">Главная</button>
                {role === 'employee' && (
                    <button className={page === 'profile' ? 'active' : ''} onClick={() => onNavigate('profile')} type="button">Профиль</button>
                )}
                <button className={page === 'support' ? 'active' : ''} onClick={() => onNavigate('support')} type="button">Тех. поддержка</button>
                {role && <button onClick={onLogout} type="button">Выйти</button>}
            </nav>
        </header>
    )
}