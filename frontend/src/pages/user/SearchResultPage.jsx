import { useState } from "react";
// import { useSearchParams } from "react-router-dom";
import UserLayout from "../../components/layout/UserLayout";
import RecipeCardList from "../../components/user/RecipeCardList";
import Pagination from "../../components/common/Pagination";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchRecipes } from "../../services/recipeService";
// const DUMMY_ALL = Array.from({ length: 12 }, (_, i) => ({
//   id: i + 1,
//   title: "Recipe Title",
//   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
// }))

// const PER_PAGE = 6

// export default function SearchResultPage() {
//   const [searchParams] = useSearchParams()
//   const query = searchParams.get("q") || ""
//   const [currentPage, setCurrentPage] = useState(1)

//   const filtered = DUMMY_ALL.filter((r) =>
//     r.title.toLowerCase().includes(query.toLowerCase())
//   )
//   const totalPages = Math.ceil(filtered.length / PER_PAGE)
//   const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

//   return (
//     <UserLayout>
//       <div className="flex flex-col gap-4">
//         <div>
//           <p className="text-sm text-gray-500">
//             Find : <span className="font-semibold text-gray-800">{query}</span>
//           </p>
//           <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
//         </div>
//         {paginated.length === 0 ? (
//           <div className="flex items-center justify-center h-64 text-gray-300 text-sm">
//             No recipes found.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             {paginated.map((r) => (
//               <RecipeCardList key={r.id} {...r} />
//             ))}
//           </div>
//         )}
//       </div>
//     </UserLayout>
//   )
// }

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const [currentPage, setCurrentPage] = useState(1);

  const [recipes, setRecipes] = useState([]);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSearchResults();
  }, [query, currentPage]);

  async function fetchSearchResults() {
    try {
      const data = await searchRecipes(query, currentPage, 6);

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
          <p className="text-sm text-gray-500">
            Find :<span className="font-semibold text-gray-800"> {query}</span>
          </p>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {recipes.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-300 text-sm">
            No recipes found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <RecipeCardList
                key={recipe.recipe_id}
                id={recipe.recipe_id}
                title={recipe.title}
                description={recipe.description}
                image={`http://localhost:5000${recipe.imageUrl}`}
              />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
