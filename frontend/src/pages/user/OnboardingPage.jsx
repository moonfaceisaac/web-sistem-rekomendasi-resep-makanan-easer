// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { useAuthStore } from "../../store/authStore"
// import { createBookmark } from "../../services/userService"

// const DUMMY_RECIPES = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, title: "Recipe Title" }))

// export default function OnboardingPage() {
//   const [selected, setSelected] = useState([])
//   const navigate = useNavigate()
//   const setHasInteraction = useAuthStore((s) => s.setHasInteraction)

//   const toggle = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     )
//   }

//   const handlePick = () => {
//     setHasInteraction(true)
//     // TODO: kirim selected ke recommendationService
//     navigate("/home")
//   }

//   const handleSkip = () => {
//     setHasInteraction(false)
//     navigate("/home")
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl">
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-bold">Hey foodie!</h1>
//           <p className="text-gray-500 text-sm mt-2">What kind of dishes do you enjoy?</p>
//           <p className="text-gray-500 text-sm">Choose a few favorites (yes, you can pick more than one!),</p>
//           <p className="text-gray-500 text-sm italic">and we&apos;ll tailor recommendations to your taste.</p>
//         </div>

//         <div className="border border-gray-200 rounded-xl p-4 grid grid-cols-4 gap-4 mb-6">
//           {DUMMY_RECIPES.map((recipe) => (
//             <button
//               key={recipe.id}
//               onClick={() => toggle(recipe.id)}
//               className={`flex flex-col items-center justify-end rounded-xl border-2 h-28 p-2 text-xs font-medium transition
//                 ${selected.includes(recipe.id)
//                   ? "border-gray-900 bg-gray-100"
//                   : "border-gray-200 bg-gray-50 hover:border-gray-400"
//                 }`}
//             >
//               <span className="text-gray-500">{recipe.title}</span>
//             </button>
//           ))}
//         </div>

//         <div className="flex items-center justify-between">
//           <span className="text-gray-300 text-sm">●</span>
//           <button
//             onClick={handlePick}
//             disabled={selected.length === 0}
//             className="bg-gray-900 text-white px-10 py-2 rounded-md text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             Let&apos;s Pick
//           </button>
//           <button
//             onClick={handleSkip}
//             className="text-sm text-gray-400 hover:text-gray-600 transition"
//           >
//             Skip For Now
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { createBookmark } from "../../services/userService";
import { getRandomRecipes } from "../../services/recipeService";

export default function OnboardingPage() {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const setHasInteraction = useAuthStore((s) => s.setHasInteraction);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const data = await getRandomRecipes();

        setRecipes(data.recipes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  const toggle = (recipeId) => {
    setSelected((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId],
    );
  };

  const handlePick = async () => {
    try {
      await Promise.all(selected.map((recipeId) => createBookmark(recipeId)));

      setHasInteraction(true);

      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Failed to save selected recipes");
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading recipes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Hey foodie!</h1>

          <p className="text-gray-500 text-sm mt-2">
            What kind of dishes do you enjoy?
          </p>

          <p className="text-gray-500 text-sm">
            Choose a few favorites (yes, you can pick more than one!),
          </p>

          <p className="text-gray-500 text-sm italic">
            and we'll tailor recommendations to your taste.
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {recipes.map((recipe) => (
            <button
              key={recipe.recipe_id}
              onClick={() => toggle(recipe.recipe_id)}
              className={`
                flex flex-col items-center justify-end
                rounded-xl border-2 h-28 p-2 text-xs font-medium transition
                ${
                  selected.includes(recipe.recipe_id)
                    ? "border-gray-900 bg-gray-100"
                    : "border-gray-200 bg-gray-50 hover:border-gray-400"
                }
              `}
            >
              <span className="text-gray-500 text-center">{recipe.title}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">
            {selected.length} selected
          </span>

          <button
            onClick={handlePick}
            disabled={selected.length === 0}
            className="
              bg-gray-900 text-white px-10 py-2
              rounded-md text-sm font-semibold
              hover:bg-gray-700 transition
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            Let's Pick
          </button>

          <button
            onClick={handleSkip}
            className="
              text-sm text-gray-400
              hover:text-gray-600
              transition
            "
          >
            Skip For Now
          </button>
        </div>
      </div>
    </div>
  );
}
