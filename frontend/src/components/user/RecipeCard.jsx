import { useNavigate } from "react-router-dom"

export default function RecipeCard({ id, title, image }) {
  const navigate = useNavigate()
  

  return (
    <button
      onClick={() => navigate(`/recipe/${id}`)}
      className="flex flex-col w-full bg-gray-100 border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition text-left"
    >
      <div className="w-full aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
        {image
          ? <img src={image} alt={title} className="w-full h-full object-cover" />
          : <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4 4 4 4-6 4 6" />
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
            </svg>
        }
      </div>
      <div className="px-3 py-2">
        <p className="text-xs font-medium text-gray-600 truncate">{title}</p>
      </div>
    </button>
  )
}