import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { createBookmark } from "../../services/userService";
import { getRandomRecipes } from "../../services/recipeService";

export default function OnboardingPage() {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rerandomizing, setRerandomizing] = useState(false);

  const navigate = useNavigate();
  const setHasInteraction = useAuthStore((s) => s.setHasInteraction);

  const fetchRecipes = async ({ isRerandomize = false } = {}) => {
    try {
      if (isRerandomize) {
        setRerandomizing(true);
      }

      const data = await getRandomRecipes();

      setRecipes(data.recipes || []);
      setSelected([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      if (isRerandomize) {
        setRerandomizing(false);
      }
    }
  };

  useEffect(() => {
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



      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Failed to save selected recipes");
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  const handleRerandomize = () => {
    fetchRecipes({ isRerandomize: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading recipes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white shadow-md p-6 md:p-8">
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

        <div className="border border-gray-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {recipes.map((recipe) => (
            <button
              key={recipe.recipe_id}
              onClick={() => toggle(recipe.recipe_id)}
              className={`
                overflow-hidden rounded-xl border-2 text-left transition
                ${
                  selected.includes(recipe.recipe_id)
                    ? "border-gray-900 bg-gray-100"
                    : "border-gray-200 bg-gray-50 hover:border-gray-400"
                }
              `}
            >
              <div className="w-full h-28 bg-gray-100">
                {recipe.imageUrl ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${recipe.imageUrl}`}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-2 text-xs font-medium text-center text-gray-700 min-h-[48px] flex items-center justify-center">
                <span className="line-clamp-2">{recipe.title}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 md:order-1">
            <span className="text-gray-500 text-sm">
              {selected.length} selected
            </span>
            <button
              onClick={handleRerandomize}
              disabled={rerandomizing}
              className="
                text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-md
                hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300
                shadow-sm transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {rerandomizing ? "Refreshing..." : "Re-randomize"}
            </button>
          </div>

          <div className="flex items-center gap-3 md:order-2">
            <button
              onClick={handleSkip}
              className="
                text-sm text-gray-500
                hover:text-gray-700
                transition
              "
            >
              Skip For Now
            </button>

            <button
              onClick={handlePick}
              disabled={selected.length === 0}
              className="
                bg-gray-900 text-white px-6 py-2
                rounded-md text-sm font-semibold
                hover:bg-gray-700 transition
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              Let's Pick
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
