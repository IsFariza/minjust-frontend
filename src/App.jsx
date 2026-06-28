import React, { useMemo, useState } from 'react'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { EmployeeDashboard } from './pages/EmployeeDashboard'
import { AdminDashboard } from './pages/AdminDashboard'

function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('minjust-auth')
    return saved ? JSON.parse(saved) : null
  })
  const [screen, setScreen] = useState('login')

  const handleLogin = (nextAuth) => {
    setAuth(nextAuth)
    localStorage.setItem('minjust-auth', JSON.stringify(nextAuth))
    setScreen('dashboard')
  }

  const logout = () => {
    setAuth(null)
    localStorage.removeItem('minjust-auth')
    setScreen('login')
  }

  const view = useMemo(() => {
    if (!auth) {
      return screen === 'register'
        ? <RegisterPage onBack={() => setScreen('login')} />
        : <LoginPage onGoRegister={() => setScreen('register')} onLogin={handleLogin} />
    }

    return auth.role === 'admin'
      ? <AdminDashboard auth={auth} onLogout={logout} />
      : <EmployeeDashboard auth={auth} onLogout={logout} />
  }, [auth, screen])

  return view
}

export default App

