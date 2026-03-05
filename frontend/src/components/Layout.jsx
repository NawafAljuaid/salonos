import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Navigation items — easy to add new pages later
const navItems = [
  { path: '/dashboard',    label: 'Dashboard',     labelAr: 'الرئيسية',    icon: '🏠' },
  { path: '/customers',    label: 'Customers',     labelAr: 'العملاء',     icon: '👥' },
  { path: '/appointments', label: 'Appointments',  labelAr: 'المواعيد',    icon: '📅' },
  { path: '/services',     label: 'Services',      labelAr: 'الخدمات',     icon: '✂️'  },
  { path: '/payments',     label: 'Payments',      labelAr: 'المدفوعات',   icon: '💰' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [lang, setLang] = useState('en')
  const isArabic = lang === 'ar'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div
      className="flex min-h-screen bg-gray-50"
      dir={isArabic ? 'rtl' : 'ltr'}
    >

      {/* ── Sidebar ───────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-purple-600">SalonOS</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {user?.tenant?.name_en}
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                  ${isActive
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <span>{item.icon}</span>
                <span>{isArabic ? item.labelAr : item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-red-500 hover:text-red-700 text-left px-2 py-1 rounded hover:bg-red-50 transition"
          >
            {isArabic ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>

      </aside>

      {/* ── Main content ──────────────────────────── */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {navItems.find(i => i.path === location.pathname)?.[isArabic ? 'labelAr' : 'label'] || 'SalonOS'}
          </h2>

          {/* Language toggle */}
          <button
            onClick={() => setLang(isArabic ? 'en' : 'ar')}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-gray-600"
          >
            {isArabic ? 'English' : 'العربية'}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  )
}