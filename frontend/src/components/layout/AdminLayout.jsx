import { useState, useRef, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"

const menu = [
  {
    label: "Users", to: "/admin/users", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    )
  },
  {
    label: "All Recipes", to: "/admin/recipes", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
]

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex">

      {/* Sidebar */}
      <aside className="w-44 shrink-0 flex flex-col px-3 py-6 gap-1">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-gray-900 text-xs font-bold">R</span>
          </div>
          <span className="font-bold text-sm text-white hidden sm:block">Admin Dashboard</span>
        </button>
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
              ${isActive
                ? "bg-gray-700 text-white font-medium"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-100 rounded-l-2xl flex flex-col min-h-screen">

        {/* Top bar */}
        <div className="flex justify-end px-6 py-3 bg-white rounded-tl-2xl border-b border-gray-200">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition"
            >
              <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                <span className="text-gray-600 text-xs font-semibold">A</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => { setOpen(false); navigate("/login") }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {children}
        </div>

      </main>
    </div>
  )
}