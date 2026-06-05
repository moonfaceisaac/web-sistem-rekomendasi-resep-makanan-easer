import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import UserLayout from "../../components/layout/UserLayout";
import RecipeGrid from "../../components/user/RecipeGrid";

import { getRecipes } from "../../services/recipeService";
import { getRecommendations } from "../../services/recommendationService";
import { useAuthStore } from "../../store/authStore";

export default function HomePage() {
  const location = useLocation();
  const hasInteraction = useAuthStore((s) => s.hasInteraction);

  // const hasInteraction = location.state?.hasInteraction ?? false;

  console.log("HomePage rendered");

  const [recipes, setRecipes] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  useEffect(() => {
    fetchRecipes();
  }, []);

  // useEffect(() => {
  //   fetchRecommendations();
  // }, []);
  const recommendations = useAuthStore((s) => s.recommendations);

  const recommendationDirty = useAuthStore((s) => s.recommendationDirty);

  const setRecommendations = useAuthStore((s) => s.setRecommendations);

  const setRecommendationDirty = useAuthStore((s) => s.setRecommendationDirty);

  useEffect(() => {
    if (recommendations.length === 0 || recommendationDirty) {
      fetchRecommendations();
    } else {
      setRecommendedRecipes(recommendations);
    }
  }, [recommendationDirty]);

  // async function fetchRecipes() {
  //   try {
  //     const data = await getRecipes();

  //     setRecipes(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  async function fetchRecipes() {
    try {
      const data = await getRecipes();

      console.log(data);

      setRecipes(data);
    } catch (err) {
      console.log(err);
    }
  }

  // async function fetchRecommendations() {
  //   try {
  //     const data = await getRecommendations();

  //     console.log(data);

  //     setRecommendedRecipes(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  async function fetchRecommendations() {
    try {
      setLoadingRecommendations(true);

      const data = await getRecommendations();

      setRecommendedRecipes(data);

      setRecommendations(data);

      setRecommendationsDirty(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRecommendations(false);
    }
  }
  return (
    <UserLayout>
      <div className="flex flex-col gap-6 h-full">
        {hasInteraction && (
          <>
            {loadingRecommendations ? (
              <div className="bg-white rounded-xl p-6">
                Loading recommendations...
              </div>
            ) : (
              <RecipeGrid
                title="Recommended for You"
                recipes={recommendedRecipes}
                navigateTo="/recipes/recommended"
              />
            )}
          </>
        )}

        <RecipeGrid
          title="All Recipes"
          recipes={recipes}
          navigateTo="/recipes/all"
        />
      </div>
    </UserLayout>
  );

  // <UserLayout>
  //   <div className="flex flex-col gap-6 h-full">
  //     {hasInteraction && (
  //       <RecipeGrid
  //         title="Recommended for You"
  //         recipes={recommendedRecipes}
  //         navigateTo="/recipes/recommended"
  //       />
  //     )}

  //     <RecipeGrid
  //       title="All Recipes"
  //       recipes={recipes}
  //       navigateTo="/recipes/all"
  //     />
  //   </div>
  // </UserLayout>
}
