// import { useState } from "react";
// import UserLayout from "../../components/layout/UserLayout";
// import ProfileLayout from "../../components/layout/ProfileLayout";
// import RecipeCardList from "../../components/user/RecipeCardList";

// const DUMMY = Array.from({ length: 6 }, (_, i) => ({
//   id: i + 1,
//   title: "Recipe Title",
//   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
// }));

// export default function BookmarkPage() {
//   const [query, setQuery] = useState("");
//   const filtered = DUMMY.filter((r) =>
//     r.title.toLowerCase().includes(query.toLowerCase()),
//   );

//   return (
//     <UserLayout>
//       <ProfileLayout>
//         <div className="flex flex-col gap-3">
//           <input
//             type="text"
//             placeholder="Find your Recipe"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
//           />
//           {filtered.length === 0 ? (
//             <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
//               No bookmarks found.
//             </div>
//           ) : (
//             filtered.map((r) => (
//               <RecipeCardList
//                 key={bookmark.recipe.recipe_id}
//                 id={bookmark.recipe.recipe_id}
//                 title={bookmark.recipe.title}
//               />
//             ))
//           )}
//         </div>
//         <div className="flex justify-center mt-4">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </ProfileLayout>
//     </UserLayout>
//   );
// }
import { useState, useEffect } from "react";
import UserLayout from "../../components/layout/UserLayout";
import ProfileLayout from "../../components/layout/ProfileLayout";
import RecipeCardList from "../../components/user/RecipeCardList";
import Pagination from "../../components/common/Pagination";
import { getBookmarks } from "../../services/userService";

export default function BookmarkPage() {
  const [query, setQuery] = useState("");

  const [bookmarks, setBookmarks] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        setLoading(true);

        const data = await getBookmarks(
          query,
          currentPage,
          10,
        );

        setBookmarks(data.bookmarks);

        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(() => {
      fetchBookmarks();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, currentPage]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);

    setCurrentPage(1);
  };

  return (
    <UserLayout>
      <ProfileLayout>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Find your Recipe"
            value={query}
            onChange={handleSearchChange}
            className="
              w-full
              border
              border-gray-200
              rounded-lg
              px-4
              py-2
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-gray-400
            "
          />

          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Loading bookmarks...
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
              No bookmarks found.
            </div>
          ) : (
            <>
              {bookmarks.map((bookmark) => (
                <RecipeCardList
                  key={bookmark.recipe.recipe_id}
                  id={bookmark.recipe.recipe_id}
                  title={bookmark.recipe.title}
                  image={`http://localhost:5000${bookmark.recipe.imageUrl}`}
                />
              ))}

              <div className="flex justify-center mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </ProfileLayout>
    </UserLayout>
  );
}