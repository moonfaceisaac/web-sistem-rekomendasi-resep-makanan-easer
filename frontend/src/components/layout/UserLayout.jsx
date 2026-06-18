import { useEffect } from "react";
import Navbar from "./Navbar";
import { useAuthStore } from "../../store/authStore";
import { getUserProfile } from "../../services/userService";

export default function UserLayout({ children }) {
  const username = useAuthStore((s) => s.username);
  const profilePhoto = useAuthStore((s) => s.profilePhoto);
  const setProfilePhoto = useAuthStore((s) => s.setProfilePhoto);

  useEffect(() => {
    let cancelled = false;

    async function loadProfilePhoto() {
      try {
        const data = await getUserProfile();
        if (!cancelled) {
          setProfilePhoto(data.user?.photo || null);
        }
      } catch {
        if (!cancelled) {
          setProfilePhoto(null);
        }
      }
    }

    loadProfilePhoto();

    return () => {
      cancelled = true;
    };
  }, [setProfilePhoto]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar username={username} avatar={profilePhoto} />
      <main className="flex-1 flex flex-col p-6 overflow-auto">{children}</main>
    </div>
  );
}
