import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import OnboardingPage from "../pages/user/OnboardingPage";
import SearchPage from "../pages/user/SearchPage";
import SearchResultPage from "../pages/user/SearchResultPage";
import AllRecipesPage from "../pages/user/AllRecipesPage";
import RecommendedPage from "../pages/user/RecommendedPage";
import RecipeDetailPage from "../pages/user/RecipeDetailPage";
import ProfilePage from "../pages/user/ProfilePage";
import BookmarkPage from "../pages/user/BookmarkPage";
import RatedPage from "../pages/user/RatedPage";
import ManageUsersPage from "../pages/admin/ManageUsersPage";
import ManageRecipesPage from "../pages/admin/ManageRecipesPage";
import RootRedirect from "./RootRedirect";
import { ProtectedRoutesAdmin } from "./ProtectedRoute";
import { ProtectedRoutesUser } from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/logout" element={<LoginPage />} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route element={<ProtectedRoutesUser />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<SearchPage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/recipes/all" element={<AllRecipesPage />} />
        <Route path="/recipes/recommended" element={<RecommendedPage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/bookmarked" element={<BookmarkPage />} />
        <Route path="/profile/rated" element={<RatedPage />} />
      </Route>
      <Route element={<ProtectedRoutesAdmin />}>
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        <Route path="/admin/users" element={<ManageUsersPage />} />
        <Route path="/admin/recipes" element={<ManageRecipesPage />} />
      </Route>
    </Routes>
  );
}
