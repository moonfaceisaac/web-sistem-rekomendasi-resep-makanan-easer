import Navbar from "./Navbar"

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}