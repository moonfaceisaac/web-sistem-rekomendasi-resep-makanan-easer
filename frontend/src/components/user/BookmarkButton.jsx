import { useState } from "react"

export default function BookmarkButton({ bookmarked = false, onToggle }) {
  const [saved, setSaved] = useState(bookmarked)

  const handleClick = (e) => {
    e.stopPropagation()
    setSaved(!saved)
    onToggle?.(!saved)
  }

  return (
    <button
      onClick={handleClick}
      className="focus:outline-none transition"
      title={saved ? "Remove bookmark" : "Bookmark"}
    >
      <svg
        className={`w-4 h-4 transition-colors ${saved ? "text-gray-900" : "text-gray-300 hover:text-gray-600"}`}
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  )
}