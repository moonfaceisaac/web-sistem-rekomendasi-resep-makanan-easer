import Navbar from "./Navbar";
import { useAuthStore } from "../../store/authStore";

export default function UserLayout({ children }) {
  const username = useAuthStore((s) => s.username);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar username={username} />
      <main className="flex-1 flex flex-col p-6 overflow-auto">{children}</main>
    </div>
  );
}
