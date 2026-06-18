// import { useNavigate } from "react-router-dom"
// import RecipeCard from "./RecipeCard"

// export default function RecipeGrid({ title, recipes = [], navigateTo }) {
//   const navigate = useNavigate()

//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
//       <div className="flex items-center justify-between">
//         <h2 className="font-bold text-base">{title}</h2>
//         {navigateTo && (
//           <button
//             onClick={() => navigate(navigateTo)}
//             className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
//           >
//             ALL &gt;
//           </button>
//         )}
//       </div>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
//         {recipes.map((r) => (
//           <RecipeCard key={r.id} id={r.id} title={r.title} image={r.image} />
//         ))}
//       </div>
//     </div>
//   )
// }

import { useNavigate } from "react-router-dom";
import RecipeCard from "./RecipeCard";


export default function RecipeGrid({ title, recipes = [], navigateTo }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base">{title}</h2>

        {navigateTo && (
          <button
            onClick={() => navigate(navigateTo)}
            className="
bg-gray-900
text-white
text-xs
px-3
py-1.5
rounded-lg
hover:bg-gray-700
transition
"
          >
            ALL &gt;
          </button>
        )}
      </div>

      <div
        className="
grid
grid-cols-2
sm:grid-cols-3
md:grid-cols-4
xl:grid-cols-5
gap-3
"
      >
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.recipe_id}
            id={recipe.recipe_id}
            title={recipe.title}
            image={`${import.meta.env.VITE_API_URL}${recipe.imageUrl}`}
          />
        ))}
      </div>
    </div>
  );
}
