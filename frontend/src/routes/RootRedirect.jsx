import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RootRedirect() {
  const token = useAuthStore((s) => s.token);
  const accountType = useAuthStore((s) => s.accountType);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (accountType === "ADMIN") {
    return <Navigate to="/admin/users" replace />;
  }

  return <Navigate to="/home" replace />;
}