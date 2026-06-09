import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import UserLayout from "../../components/layout/UserLayout";
import RatingStars from "../../components/user/RatingStars";
import { getRecipeById } from "../../services/recipeService";
import { getRecipeByIdWithInteraction } from "../../services/recipeService";
import { useEffect } from "react";
import {
  createBookmark,
  deleteBookmark,
  createRating,
  deleteRating,
} from "../../services/userService";
import { useAuthStore } from "../../store/authStore";

export default function RecipeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [recipe, setRecipe] = useState(null);

  const markRecommendationDirty = useAuthStore((s) => s.markRecommendationDirty);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  //kenapa useeffect diatas bergantung dengan id? ketika kita akses suatu detailpage dari sebuah resep, id resep diambil saat fetchRecipe() berjalan di bagian getRecipeByIdWithInteraction(id);
  //setelah di ambil, seharusnya tidak lagi berubah-ubah atau dijalan ulang

  async function fetchRecipe() {
    try {
      const data = await getRecipeByIdWithInteraction(id);

      setRecipe(data);

      setSaved(data.isBookmarked || false); // setSaved simpan state bookmarked atau tidak dari payload data isBookmarked yang kita ambil dari backend.  knp || false? padahal isBookmarked menyipampan true/false.

      // setBookmarkId(data.bookmarkId || null);

      setUserRating(data.userRating || null); // hampir sama dengan setSaved knp || null?
    } catch (err) {
      console.log(err);
    }
  }

  const handleSave = async () => {
    try {
      if (saved) {
        await deleteBookmark(Number(id));

        setSaved(false);
        markRecommendationDirty();
      } else {
        await createBookmark(Number(id));

        setSaved(true);
        markRecommendationDirty();
      }
      // seharusnya disini markRecommendationDirty?
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to update bookmark");
    }
  };

  const handleRate = async (score) => {
    try {
      await createRating({
        recipeId: Number(id),
        score,
      });

      setUserRating(score);
      markRecommendationDirty();
      // seharusnya disini markRecommendationDirty?
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to rate recipe");
    }
  };

  const handleUndoRating = async () => {
    try {
      await deleteRating(Number(id));

      setUserRating(null);
      markRecommendationDirty();
      // seharusnya disini markRecommendationDirty?
    } catch (err) {
      console.log(err);

      alert("Failed to remove rating");
    }
  };
  if (!recipe) {
    return (
      <UserLayout>
        <p>Loading...</p>
      </UserLayout>
    );
  }
  console.log(recipe);
  return (
    <UserLayout>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-900 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-extrabold tracking-wide uppercase">
            {recipe.title}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-64 h-56 shrink-0 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
            {recipe.imageUrl ? (
              <img
                src={`http://localhost:5000${recipe.imageUrl}`}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-16 h-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4-4 4 4 4-6 4 6"
                />
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  strokeWidth={1}
                />
              </svg>
            )}
          </div>

          <div className="flex-1">
            <h2 className="font-bold text-base mb-2">OVERVIEW</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
              eros libero. Maecenas lorem ex, bibendum in efficitur vitae,
              vehicula in nibh. Pellentesque a malesuada mauris. Donec sed risus
              eu tortor volutpat vulputate.
            </p>

            <div className="mb-4">
              <RatingStars
                avgRating={recipe.averageRating || 0}
                totalRatings={recipe.totalRatings || 0}
                userRating={userRating}
                onRate={handleRate}
              />
              {userRating && (
                <button
                  onClick={handleUndoRating}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove Rating
                </button>
              )}
            </div>

            <button
              onClick={handleSave}
              className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium transition
                ${
                  saved
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              <svg
                className="w-4 h-4"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              {saved ? "SAVED" : "SAVE RECIPE"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-bold text-base mb-3">INGREDIENTS :</h2>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((item, i) => (
                <li key={i} className="text-sm text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-base mb-3">INSTRUCTIONS :</h2>
            <ol className="list-decimal list-inside space-y-1">
              {/* {recipe.cookingDirections.directions.map((step, i) => (
                <li key={i} className="text-sm text-gray-600">
                  {step}
                </li>
              ))} */}
              {recipe.cookingDirections.directions
                .split("\n")
                .map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
            </ol>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-bold text-base mb-3">NUTRITIONS :</h2>
          <p className="text-sm text-gray-600">
            <ul className="space-y-1">
              <li>Calories: {recipe.nutritions.calories.displayValue} kcal</li>

              <li>Protein: {recipe.nutritions.protein.displayValue} g</li>

              <li>Fat: {recipe.nutritions.fat.displayValue} g</li>

              <li>
                Carbohydrates: {recipe.nutritions.carbohydrates.displayValue} g
              </li>
            </ul>
          </p>
        </div>
      </div>
    </UserLayout>
  );
}
