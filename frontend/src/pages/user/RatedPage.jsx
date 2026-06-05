// import { useState } from "react"
// import UserLayout from "../../components/layout/UserLayout"
// import ProfileLayout from "../../components/layout/ProfileLayout"
// import { useNavigate } from "react-router-dom"

// const DUMMY = Array.from({ length: 6 }, (_, i) => ({
//   id: i + 1,
//   title: "Recipe Title",
//   image: null,
//   userRating: 5,
// }))

// function RatedCard({ id, title, image, userRating }) {
//   const navigate = useNavigate()
//   return (
//     <div
//       onClick={() => navigate(`/recipe/${id}`)}
//       className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition"
//     >
//       <div className="w-12 h-12 shrink-0 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
//         {image
//           ? <img src={image} alt={title} className="w-full h-full object-cover" />
//           : <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4 4 4 4-6 4 6" />
//               <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
//             </svg>
//         }
//       </div>
//       <p className="flex-1 text-sm font-medium text-gray-800 truncate">{title}</p>
//       <div className="flex shrink-0">
//         {Array.from({ length: 5 }, (_, i) => (
//           <svg key={i} className={`w-4 h-4 ${i < userRating ? "text-yellow-400" : "text-gray-200"}`}
//             fill="currentColor" viewBox="0 0 20 20">
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           </svg>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default function RatedPage() {
//   const [query, setQuery] = useState("")
//   const filtered = DUMMY.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))

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
//               No rated recipes found.
//             </div>
//           ) : (
//             filtered.map((r) => <RatedCard key={r.id} {...r} />)
//           )}
//         </div>
//       </ProfileLayout>
//     </UserLayout>
//   )
// }
import { useState, useEffect } from "react";
import UserLayout from "../../components/layout/UserLayout";
import ProfileLayout from "../../components/layout/ProfileLayout";
import Pagination from "../../components/common/Pagination";
import { useNavigate } from "react-router-dom";
import { getRatings } from "../../services/userService";

function RatedCard({ id, title, userRating }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/recipe/${id}`)}
      className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition"
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 truncate">
          {title}
        </p>
      </div>

      <div className="flex shrink-0">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < userRating ? "text-yellow-400" : "text-gray-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

export default function RatedPage() {
  const [query, setQuery] = useState("");

  const [ratings, setRatings] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const data = await getRatings(
          query,
          currentPage,
          10
        );

        setRatings(data.ratings);

        setTotalPages(data.totalPages);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
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
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Loading...
            </div>
          ) : ratings.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
              No rated recipes found.
            </div>
          ) : (
            <>
              {ratings.map((rating) => (
                <RatedCard
                  key={rating.recipe.recipe_id}
                  id={rating.recipe.recipe_id}
                  title={rating.recipe.title}
                  
                  userRating={rating.score}
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