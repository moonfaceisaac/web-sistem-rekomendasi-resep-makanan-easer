import { useNavigate } from "react-router-dom"
import BookmarkButton from "./BookmarkButton"
import api from "../../services/api"

export default function RecipeCardList({ id, title, description, image }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/recipe/${id}`)}
      className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3 cursor-pointer hover:shadow-md transition"
    >
      <div className="w-24 h-24 shrink-0 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        {image
          ? <img src={`${image}`} alt={title} className="w-full h-full object-cover" />
          : <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4 4 4 4-6 4 6" />
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
            </svg>
        }
      </div>
      <div className="flex flex-col flex-1 min-w-0 justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
          <p className="text-xs text-gray-400 mt-1 line-clamp-3">{description}</p>
        </div>
        <div className="flex justify-end mt-1">
          <BookmarkButton onToggle={() => {
            // TODO: bookmarkService.toggle(id)
          }} />
        </div>
      </div>
    </div>
  )
}