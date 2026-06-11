import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoutesAdmin() {
  const token = useAuthStore((s) => s.token);
  const accountType = useAuthStore((s) => s.accountType);

  if (!token) {
    return <Navigate to="/" />;
  } else {
    if (accountType !== "ADMIN") {
      return <Navigate to="/" replace />;
    } else {
      return <Outlet />;
    }
  }
}

export function ProtectedRoutesUser() {
  const token = useAuthStore((s) => s.token);
  const accountType = useAuthStore((s) => s.accountType);

  if (!token) {
    return <Navigate to="/" replace />;
  } else {
    if (accountType !== "USER") {
      return <Navigate to="/" replace />;
    } else {
      return <Outlet />;
    }
  }
}

export function ProtectedRoutesExistAuth() {
  
}
