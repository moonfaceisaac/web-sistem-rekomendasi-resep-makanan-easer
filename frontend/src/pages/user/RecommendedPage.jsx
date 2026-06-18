import UserLayout from "../../components/layout/UserLayout";
import RecipeCardList from "../../components/user/RecipeCardList";
import { useAuthStore } from "../../store/authStore";

// const DUMMY = Array.from({ length: 12 }, (_, i) => ({
//   id: i + 1,
//   title: "Recipe Title",
//   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
// }))

export default function RecommendedPage() {
  const recommendations = useAuthStore((s) => s.recommendations);
  // const [currentPage, setCurrentPage] = useState(1)
  // const totalPages = Math.ceil(DUMMY.length / PER_PAGE)
  // const paginated = DUMMY.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  return (
    <UserLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-lg">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recommendations.map((r) => (
            <RecipeCardList key={r.recipe_id}
              id={r.recipe_id}
              title={r.title}
              image={`${import.meta.env.VITE_API_URL}${r.imageUrl}`}
            />
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
