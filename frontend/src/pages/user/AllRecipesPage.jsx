import { useEffect, useState } from "react";
import UserLayout from "../../components/layout/UserLayout";
import RecipeCardList from "../../components/user/RecipeCardList";
import Pagination from "../../components/common/Pagination";
import { getRecipesAll } from "../../services/recipeService";

const PER_PAGE = 6;

export default function AllRecipesPage() {
  const [recipes, setRecipes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRecipes();
  }, [currentPage]);

  async function fetchRecipes() {
    try {
      const data = await getRecipesAll(
        currentPage,

        PER_PAGE,
      );

      setRecipes(data.recipes);

      setTotalPages(data.totalPages);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <UserLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-lg">All Recipes</h2>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <RecipeCardList
              key={recipe.recipe_id}
              id={recipe.recipe_id}
              title={recipe.title}
              image={`http://localhost:5000${recipe.imageUrl}`}
            />
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
