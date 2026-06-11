import { useEffect, useState } from "react";

import UserLayout from "../../components/layout/UserLayout";
import RecipeGrid from "../../components/user/RecipeGrid";

import { getRecipes } from "../../services/recipeService";
import { getRecommendations } from "../../services/recommendationService";
import { useAuthStore } from "../../store/authStore";

export default function HomePage() {
  const hasInteraction = useAuthStore((s) => s.hasInteraction);
  const [recipes, setRecipes] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const recommendations = useAuthStore((s) => s.recommendations);
  const recommendationDirty = useAuthStore((s) => s.recommendationDirty);
  const setRecommendations = useAuthStore((s) => s.setRecommendations);
  // const token = useAuthStore.getState().token;
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchRecipes();
  }, []);

  useEffect(() => {

    async function fetchRecommendations() {
      try {
        setLoadingRecommendations(true);
        const data = await getRecommendations();
        setRecommendations(data);
        // console.log(recommendations);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingRecommendations(false);
      }
    }
    if (recommendationDirty) {
      fetchRecommendations();
    }
  }, [recommendationDirty]);

  return (
    // <UserLayout>
    //   <div className="flex flex-col gap-6 h-full">
    //     {hasInteraction && (
    //       <>
    //         {loadingRecommendations ? (
    //           <div className="bg-white rounded-xl p-6">
    //             Loading recommendations...
    //           </div>
    //         ) : (
    //           <RecipeGrid
    //             title="Recommended for You"
    //             // recipes={recommendedRecipes}
    //             recipes={recommendations}
    //             navigateTo="/recipes/recommended"
    //           />
    //         )}
    //       </>
    //     )}

    //     <RecipeGrid
    //       title="All Recipes"
    //       recipes={recipes}
    //       navigateTo="/recipes/all"
    //     />
    //   </div>
    // </UserLayout>
    <UserLayout>
      <div className="flex flex-col gap-6 h-full">
        {loadingRecommendations ? (
          <div className="bg-white rounded-xl p-6">
            Loading recommendations...
          </div>
        ) : hasInteraction ? (
          <RecipeGrid
            title="Recommended for You"
            recipes={recommendations}
            navigateTo="/recipes/recommended"
          />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-lg mb-2">Recommended for You</h2>
            <p className="text-gray-500 text-sm">
              You have to interact with recipes first (bookmark or rate them)
              before personalized recommendations can be generated.
            </p>
          </div>
        )}

        <RecipeGrid
          title="All Recipes"
          recipes={recipes}
          navigateTo="/recipes/all"
        />
      </div>
    </UserLayout>
  );
}
