import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function GuestRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  const accountType = useAuthStore((s) => s.accountType);

  if (token) {
    if (accountType === "ADMIN") {
      return <Navigate to="/admin/users" replace />;
    }

    return <Navigate to="/home" replace />;
  }

  return children;
}