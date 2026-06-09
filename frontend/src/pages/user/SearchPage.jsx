import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import UserLayout from "../../components/layout/UserLayout";
import RecipeGrid from "../../components/user/RecipeGrid";

import { getRecipes } from "../../services/recipeService";
import { getRecommendations } from "../../services/recommendationService";
import { useAuthStore } from "../../store/authStore";

export default function HomePage() {
  const hasInteraction = useAuthStore((s) => s.hasInteraction);
  // console.log("HomePage rendered");
  const [recipes, setRecipes] = useState([]);
  // const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const recommendations = useAuthStore((s) => s.recommendations);

  const recommendationDirty = useAuthStore((s) => s.recommendationDirty);

  const setRecommendations = useAuthStore((s) => s.setRecommendations);

  // const markRecommendationDirty = useAuthStore((s) => s.markRecommendationDirty);
  //ini seharusnya ga perlu karena mark rec dirty dilakukan di setRecommendations setelah fetch

  //AFTER RENDERING FETCH RECIPE ONLY ONCE
  useEffect(() => {
    fetchRecipes();
  }, []);

  // AFTER RENDERING AND AFTER EVERY CHANGES IN RECOMMENDATION DIRTY VALUE RUNS
  // useEffect(() => {
  //   if (recommendations.length === 0 || recommendationDirty) {
  //     fetchRecommendations();
  //   }
  // }, [recommendations, recommendationDirty]);
  useEffect(() => {
    if (recommendationDirty) {
      fetchRecommendations();
    }
  }, [recommendationDirty]);
  
  async function fetchRecipes() {
    try {
      const data = await getRecipes();

      // console.log(data);

      setRecipes(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchRecommendations() {
    try {
      setLoadingRecommendations(true);

      const data = await getRecommendations();

      // setRecommendedRecipes(data);
      // //Ngisi data ke list rekomendasi untuk ditampilkan

      setRecommendations(data); //Save data yang terisi ke zustand dan membuat recomendationDirty:false di state zustand
      console.log(recommendations);
      // markRecommendationDirty(false);
      // ini seharusnya ga perlu? karena markRecommendationdiry di authStore adalah semacam void function yang tidak menerima value, dan setelah fetch recommendationDirty:false sudah dilakukan di setReccommendation(data) di line sebelumnya
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRecommendations(false);
    }
  }
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
