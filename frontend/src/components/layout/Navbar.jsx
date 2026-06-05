import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isOnProfile = location.pathname.startsWith("/profile")

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleBlur = () => {
    setTimeout(() => setFocused(false), 150)
  }

  return (
    <>
      {focused && query.trim() !== "" && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => { setFocused(false); setQuery("") }}
        />
      )}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full flex items-center justify-between px-6 py-3 gap-4">

          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <span className="font-bold text-sm hidden sm:block">RecipeApp</span>
          </button>

          <input
            key={location.pathname}
            type="text"
            placeholder="Find your recipe"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            className={`border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300
              ${focused ? "w-full" : "w-48 sm:w-64"}`}
          />

          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                <span className="text-gray-600 text-xs font-semibold">U</span>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Username</span>
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {isOnProfile ? (
                  <button
                    onClick={() => { setOpen(false); navigate("/home") }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    Home
                  </button>
                ) : (
                  <button
                    onClick={() => { setOpen(false); navigate("/profile") }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    Profile
                  </button>
                )}
                <hr className="border-gray-100" />
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
      </nav>
    </>
  )
}