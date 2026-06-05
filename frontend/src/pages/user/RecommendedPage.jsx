import { useState } from "react"
import UserLayout from "../../components/layout/UserLayout"
import RecipeCardList from "../../components/user/RecipeCardList"
import Pagination from "../../components/common/Pagination"

// const DUMMY = Array.from({ length: 12 }, (_, i) => ({
//   id: i + 1,
//   title: "Recipe Title",
//   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
// }))

const PER_PAGE = 6

export default function RecommendedPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(DUMMY.length / PER_PAGE)
  const paginated = DUMMY.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  return (
    <UserLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-lg">Recommended for You</h2>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {paginated.map((r) => (
            <RecipeCardList key={r.id} {...r} />
          ))}
        </div>
      </div>
    </UserLayout>
  )
}