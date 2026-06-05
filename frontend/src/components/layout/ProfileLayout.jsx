import { NavLink } from "react-router-dom"

const menu = [
  { label: "Data User", to: "/profile", icon: "person" },
  { label: "Bookmarked", to: "/profile/bookmarked", icon: "bookmark" },
  { label: "Rated", to: "/profile/rated", icon: "star" },
]

function Icon({ name }) {
  if (name === "person") return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A8 8 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
  if (name === "bookmark") return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  )
  if (name === "star") return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
  return null
}

export default function ProfileLayout({ children }) {
  return (
    <div className="flex gap-0 h-full">
      {/* Sidebar */}
      <aside className="w-44 shrink-0 flex flex-col gap-1 pr-4">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/profile"}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
              ${isActive
                ? "bg-gray-900 text-white font-medium"
                : "text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}