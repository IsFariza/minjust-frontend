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

// import { useEffect, useMemo, useState } from 'react'
// import './App.css'
// import { login, registerEmployee } from './api/authApi'
// import { getEmployeeProfile, getHandbook } from './api/employeeApi'
// import {
//   createPasswordRequest,
//   getAllRequests,
//   getMyRequests,
//   reviewRequest,
// } from './api/requestApi'
// import { DEFAULT_NOTICE, REGISTER_FIELDS, SYSTEMS } from './utils/constants'

// const extractToken = (data) => data?.token || data?.access_token || data?.jwt || data?.accessToken || ''
// const asArray = (data) => Array.isArray(data) ? data : data?.items || data?.data || data?.content || []
// const requestId = (item) => item?.id || item?.request_id || item?.password_request_id
// const employeeIin = (profile) => profile?.iin || profile?.employee_iin || profile?.username || ''

// const statusLabel = (status) => {
//   const normalized = String(status || 'pending').toLowerCase()
//   if (normalized === 'approved') return 'Одобрено'
//   if (normalized === 'rejected') return 'Отклонено'
//   return 'На рассмотрении'
// }

// const statusClass = (status) => {
//   const normalized = String(status || 'pending').toLowerCase()
//   if (normalized === 'approved') return 'approved'
//   if (normalized === 'rejected') return 'rejected'
//   return 'pending'
// }

// const emptyRegisterForm = REGISTER_FIELDS.reduce((acc, [name]) => ({ ...acc, [name]: '' }), {})

// function Topbar({ page, role, onNavigate, onLogout }) {
//   return (
//     <header className="topbar">
//       <button className="brand" onClick={() => onNavigate('home')} type="button">MINJUST.KZ</button>
//       <nav>
//         <button className={page === 'home' ? 'active' : ''} onClick={() => onNavigate('home')} type="button">Главная</button>
//         {role === 'employee' && (
//           <button className={page === 'profile' ? 'active' : ''} onClick={() => onNavigate('profile')} type="button">Профиль</button>
//         )}
//         <button className={page === 'support' ? 'active' : ''} onClick={() => onNavigate('support')} type="button">Тех. поддержка</button>
//         {role && <button onClick={onLogout} type="button">Выйти</button>}
//       </nav>
//     </header>
//   )
// }

// function LoginPage({ onLogin, onGoRegister }) {
//   const [role, setRole] = useState('employee')
//   const [form, setForm] = useState({ username: '', password: '' })
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const submit = async (event) => {
//     event.preventDefault()
//     setError('')
//     setLoading(true)

//     try {
//       const data = await login({ ...form, role })
//       const token = extractToken(data)
//       if (!token) throw new Error('В ответе сервера не найден токен')
//       onLogin({ token, role, username: form.username })
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <main className="login-screen">
//       <section className="ministry-title">Министерство юстиции Республики Казахстан</section>
//       <form className="auth-card" onSubmit={submit}>
//         <h1>Войти</h1>
//         <div className="role-switch">
//           <button className={role === 'employee' ? 'selected' : ''} onClick={() => setRole('employee')} type="button">Сотрудник</button>
//           <button className={role === 'admin' ? 'selected' : ''} onClick={() => setRole('admin')} type="button">Модератор</button>
//         </div>
//         <label>
//           Логин / ИИН
//           <input
//             autoComplete="username"
//             onChange={(event) => setForm({ ...form, username: event.target.value })}
//             required
//             value={form.username}
//           />
//         </label>
//         <label>
//           Пароль
//           <input
//             autoComplete="current-password"
//             onChange={(event) => setForm({ ...form, password: event.target.value })}
//             required
//             type="password"
//             value={form.password}
//           />
//         </label>
//         {error && <p className="form-error">{error}</p>}
//         <button className="primary" disabled={loading} type="submit">{loading ? 'Вход...' : 'Войти'}</button>
//         {role === 'employee' && (
//           <button className="link-button" onClick={onGoRegister} type="button">
//             Вы новый сотрудник? Зарегистрироваться
//           </button>
//         )}
//       </form>
//     </main>
//   )
// }

// function RegisterPage({ onBack, embedded = false }) {
//   const [form, setForm] = useState(emptyRegisterForm)
//   const [status, setStatus] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const submit = async (event) => {
//     event.preventDefault()
//     setError('')
//     setStatus('')
//     setLoading(true)

//     try {
//       await registerEmployee(form)
//       setStatus('Учетная запись создана. Теперь можно войти через ИИН и пароль.')
//       setForm(emptyRegisterForm)
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const content = (
//       <form className="register-card" onSubmit={submit}>
//         <h1>Создание новой учетной записи</h1>
//         <div className="register-grid">
//           {REGISTER_FIELDS.map(([name, label, placeholder]) => (
//             <label key={name}>
//               {label}
//               <input
//                 autoComplete={name === 'password' ? 'new-password' : 'off'}
//                 onChange={(event) => setForm({ ...form, [name]: event.target.value })}
//                 placeholder={placeholder}
//                 required={['fullname', 'iin', 'position', 'department', 'password'].includes(name)}
//                 type={name === 'password' ? 'password' : 'text'}
//                 value={form[name]}
//               />
//             </label>
//           ))}
//         </div>
//         {status && <p className="form-success">{status}</p>}
//         {error && <p className="form-error">{error}</p>}
//         <button className="primary" disabled={loading} type="submit">
//           {loading ? 'Создание...' : 'Зарегистрироваться'}
//         </button>
//       </form>
//   )

//   if (embedded) {
//     return content
//   }

//   return (
//     <main className="page">
//       <Topbar onLogout={onBack} onNavigate={(target) => target === 'home' && onBack()} page="register" />
//       {content}
//     </main>
//   )
// }

// function NoticePanel({ role }) {
//   const [notice, setNotice] = useState(() => {
//     const saved = localStorage.getItem('minjust-notice')
//     return saved ? JSON.parse(saved) : DEFAULT_NOTICE
//   })
//   const [editing, setEditing] = useState(false)
//   const [draft, setDraft] = useState(notice)

//   const save = () => {
//     setNotice(draft)
//     localStorage.setItem('minjust-notice', JSON.stringify(draft))
//     setEditing(false)
//   }

//   return (
//     <section className="notice-panel">
//       {editing ? (
//         <div className="notice-editor">
//           <input onChange={(event) => setDraft({ ...draft, birthday: event.target.value })} value={draft.birthday} />
//           <input onChange={(event) => setDraft({ ...draft, news: event.target.value })} value={draft.news} />
//           <button className="primary small" onClick={save} type="button">Сохранить</button>
//         </div>
//       ) : (
//         <>
//           <p>{notice.birthday}</p>
//           <p>{notice.news}</p>
//           {role === 'admin' && <button className="secondary small" onClick={() => setEditing(true)} type="button">Редактировать</button>}
//         </>
//       )}
//     </section>
//   )
// }

// function ResetPasswordPanel({ profile, onCreated }) {
//   const [selected, setSelected] = useState('')
//   const [iin, setIin] = useState('')
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const submit = async (event) => {
//     event.preventDefault()
//     setError('')
//     setMessage('')

//     if (iin !== employeeIin(profile)) {
//       setError('ИИН должен совпадать с ИИН текущего пользователя.')
//       return
//     }

//     setLoading(true)
//     try {
//       await onCreated(selected, iin)
//       setMessage('Заявка отправлена модератору.')
//       setIin('')
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <section className="system-panel">
//       <h2>Выберите систему для сброса пароля:</h2>
//       <div className="system-list">
//         {SYSTEMS.map((system) => (
//           <button className={selected === system ? 'selected' : ''} key={system} onClick={() => setSelected(system)} type="button">
//             {system}
//           </button>
//         ))}
//       </div>
//       {selected && (
//         <form className="iin-form" onSubmit={submit}>
//           <label>
//             Подтвердите ИИН
//             <input onChange={(event) => setIin(event.target.value)} required value={iin} />
//           </label>
//           {message && <p className="form-success">{message}</p>}
//           {error && <p className="form-error">{error}</p>}
//           <button className="primary small" disabled={loading} type="submit">{loading ? 'Отправка...' : 'Подтвердить'}</button>
//         </form>
//       )}
//     </section>
//   )
// }

// function ProfilePage({ profile, requests, refresh }) {
//   return (
//     <section className="content-band">
//       <h1>Профиль</h1>
//       <div className="profile-card">
//         {[
//           ['ФИО', profile?.fullname || profile?.full_name],
//           ['ИИН', employeeIin(profile)],
//           ['Позиция', profile?.position],
//           ['Департамент', profile?.department],
//           ['Управление', profile?.management],
//           ['Кабинет', profile?.cabinet],
//           ['Рабочий номер', profile?.phone_work],
//           ['Личный номер', profile?.phone_personal],
//           ['Email', profile?.email],
//         ].map(([label, value]) => (
//           <div key={label}>
//             <span>{label}</span>
//             <strong>{value || 'Не указано'}</strong>
//           </div>
//         ))}
//       </div>
//       <div className="section-head">
//         <h2>Мои заявки</h2>
//         <button className="secondary small" onClick={refresh} type="button">Обновить</button>
//       </div>
//       <RequestTable items={requests} owner="employee" />
//     </section>
//   )
// }

// function HandbookPage({ items, loading, error }) {
//   return (
//     <section className="content-band">
//       <h1>Справочник</h1>
//       {loading && <p className="muted">Загрузка справочника...</p>}
//       {error && <p className="form-error">{error}</p>}
//       <div className="handbook-list">
//         {items.map((person, index) => (
//           <article className="person-card" key={person.id || person.email || index}>
//             {person.photo_url || person.photo ? (
//               <img alt={person.fullname || person.name || 'Сотрудник'} src={person.photo_url || person.photo} />
//             ) : (
//               <div className="photo-placeholder">{(person.fullname || person.name || 'МЮ').slice(0, 2)}</div>
//             )}
//             <div>
//               <h2>{person.fullname || person.name || 'ФИО не указано'}</h2>
//               <strong>{person.position || person.title || 'Должность не указана'}</strong>
//               <span>Телефон</span>
//               <b>{person.phone || person.phone_work || '+7 700 789 7908'}</b>
//               <span>Почта</span>
//               <b>{person.email || person.mail || 'email не указан'}</b>
//             </div>
//           </article>
//         ))}
//       </div>
//     </section>
//   )
// }

// function RequestTable({ items, owner, onApprove, onReject }) {
//   const [rejecting, setRejecting] = useState(null)
//   const [reason, setReason] = useState('')

//   if (!items.length) {
//     return <p className="empty">Заявок пока нет.</p>
//   }

//   return (
//     <div className="table-wrap">
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Система</th>
//             <th>ИИН</th>
//             <th>Статус</th>
//             {owner === 'employee' ? <th>Ответ</th> : <th>Действие</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item) => {
//             const id = requestId(item)
//             const isRejected = String(item.status).toLowerCase() === 'rejected'
//             const isApproved = String(item.status).toLowerCase() === 'approved'

//             return (
//               <tr key={id || `${item.system_name}-${item.employee_iin}`}>
//                 <td>{id || '-'}</td>
//                 <td>{item.system_name || item.system || '-'}</td>
//                 <td>{item.employee_iin || item.iin || '-'}</td>
//                 <td><span className={`status ${statusClass(item.status)}`}>{statusLabel(item.status)}</span></td>
//                 {owner === 'employee' ? (
//                   <td>
//                     {isApproved && <strong>Первичный пароль: {item.primary_password || item.primaryPassword || 'ожидается'}</strong>}
//                     {isRejected && <span>{item.rejection_reason || item.rejectionReason || 'Причина не указана'}</span>}
//                     {!isApproved && !isRejected && <span className="muted">Ожидает решения модератора</span>}
//                   </td>
//                 ) : (
//                   <td>
//                     {String(item.status || 'pending').toLowerCase() === 'pending' ? (
//                       <div className="actions">
//                         <button className="primary small" onClick={() => onApprove(id)} type="button">Одобрить</button>
//                         <button className="danger small" onClick={() => setRejecting(id)} type="button">Отклонить</button>
//                         {rejecting === id && (
//                           <form
//                             className="reject-form"
//                             onSubmit={(event) => {
//                               event.preventDefault()
//                               onReject(id, reason)
//                               setRejecting(null)
//                               setReason('')
//                             }}
//                           >
//                             <input onChange={(event) => setReason(event.target.value)} placeholder="Причина отказа" required value={reason} />
//                             <button className="danger small" type="submit">Отправить</button>
//                           </form>
//                         )}
//                       </div>
//                     ) : (
//                       <span className="muted">Рассмотрено</span>
//                     )}
//                   </td>
//                 )}
//               </tr>
//             )
//           })}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// function EmployeeDashboard({ auth, onLogout }) {
//   const [page, setPage] = useState('home')
//   const [profile, setProfile] = useState(null)
//   const [requests, setRequests] = useState([])
//   const [handbook, setHandbook] = useState([])
//   const [loadingHandbook, setLoadingHandbook] = useState(false)
//   const [handbookError, setHandbookError] = useState('')

//   const loadProfile = async () => {
//     const [profileData, requestData] = await Promise.all([
//       getEmployeeProfile(auth.token),
//       getMyRequests(auth.token),
//     ])
//     setProfile(profileData)
//     setRequests(asArray(requestData))
//   }

//   const loadHandbook = async () => {
//     setLoadingHandbook(true)
//     setHandbookError('')
//     try {
//       setHandbook(asArray(await getHandbook()))
//     } catch (err) {
//       setHandbookError(err.message)
//     } finally {
//       setLoadingHandbook(false)
//     }
//   }

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     loadProfile().catch(() => undefined)
//     // Initial employee data is fetched once after the token is available.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   useEffect(() => {
//     if (page === 'handbook' && !handbook.length) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       loadHandbook()
//     }
//     // Handbook is loaded lazily the first time the user opens that page.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page])

//   const createRequest = async (systemName, iin) => {
//     await createPasswordRequest(auth.token, { system_name: systemName, employee_iin: iin })
//     await loadProfile()
//   }

//   return (
//     <main className="page">
//       <Topbar onLogout={onLogout} onNavigate={setPage} page={page} role="employee" />
//       {page === 'home' && (
//         <>
//           <section className="home-actions">
//             <button onClick={() => setPage('register')} type="button">Создание учетной записи</button>
//             <button onClick={() => setPage('reset')} type="button">Сброс пароля</button>
//             <button onClick={() => setPage('handbook')} type="button">Справочник</button>
//           </section>
//           <NoticePanel role="employee" />
//         </>
//       )}
//       {page === 'register' && <RegisterPage embedded onBack={() => setPage('home')} />}
//       {page === 'reset' && <ResetPasswordPanel onCreated={createRequest} profile={profile || { iin: auth.username }} />}
//       {page === 'profile' && <ProfilePage profile={profile || { iin: auth.username }} refresh={loadProfile} requests={requests} />}
//       {page === 'handbook' && <HandbookPage error={handbookError} items={handbook} loading={loadingHandbook} />}
//       {page === 'support' && <SupportPage />}
//     </main>
//   )
// }

// function AdminDashboard({ auth, onLogout }) {
//   const [page, setPage] = useState('home')
//   const [requests, setRequests] = useState([])
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')

//   const loadRequests = async () => {
//     setError('')
//     try {
//       setRequests(asArray(await getAllRequests(auth.token)))
//     } catch (err) {
//       setError(err.message)
//     }
//   }

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     loadRequests()
//     // Initial admin queue is fetched once after login.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const approve = async (id) => {
//     await reviewRequest(auth.token, id, { status: 'approved' })
//     setMessage(`Заявка ${id} одобрена.`)
//     await loadRequests()
//   }

//   const reject = async (id, rejectionReason) => {
//     await reviewRequest(auth.token, id, { status: 'rejected', rejection_reason: rejectionReason })
//     setMessage(`Заявка ${id} отклонена.`)
//     await loadRequests()
//   }

//   return (
//     <main className="page">
//       <Topbar onLogout={onLogout} onNavigate={setPage} page={page} role="admin" />
//       {page === 'home' && (
//         <section className="content-band admin-band">
//           <div className="section-head">
//             <h1>Заявки на сброс пароля</h1>
//             <button className="secondary small" onClick={loadRequests} type="button">Обновить</button>
//           </div>
//           {message && <p className="form-success">{message}</p>}
//           {error && <p className="form-error">{error}</p>}
//           <RequestTable items={requests} onApprove={approve} onReject={reject} owner="admin" />
//           <NoticePanel role="admin" />
//         </section>
//       )}
//       {page === 'support' && <SupportPage />}
//     </main>
//   )
// }

// function SupportPage() {
//   return (
//     <section className="content-band">
//       <h1>Тех. поддержка</h1>
//       <p className="muted">По вопросам доступа обратитесь к администратору информационных систем.</p>
//     </section>
//   )
// }

// function App() {
//   const [auth, setAuth] = useState(() => {
//     const saved = localStorage.getItem('minjust-auth')
//     return saved ? JSON.parse(saved) : null
//   })
//   const [screen, setScreen] = useState('login')

//   const handleLogin = (nextAuth) => {
//     setAuth(nextAuth)
//     localStorage.setItem('minjust-auth', JSON.stringify(nextAuth))
//     setScreen('dashboard')
//   }

//   const logout = () => {
//     setAuth(null)
//     localStorage.removeItem('minjust-auth')
//     setScreen('login')
//   }

//   const view = useMemo(() => {
//     if (!auth) {
//       return screen === 'register'
//         ? <RegisterPage onBack={() => setScreen('login')} />
//         : <LoginPage onGoRegister={() => setScreen('register')} onLogin={handleLogin} />
//     }

//     return auth.role === 'admin'
//       ? <AdminDashboard auth={auth} onLogout={logout} />
//       : <EmployeeDashboard auth={auth} onLogout={logout} />
//   }, [auth, screen])

//   return view
// }

// export default App
