export default function AuthLayout({ children, title, size = "sm" }) {
  const sizes = { sm: "max-w-sm", lg: "max-w-lg" }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-md w-full ${sizes[size]} p-8`}>
        <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
        {children}
      </div>
    </div>
  )
}