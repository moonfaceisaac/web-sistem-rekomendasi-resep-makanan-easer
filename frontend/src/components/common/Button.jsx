export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "w-full rounded-lg py-2.5 text-sm font-semibold transition"
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-700",
    ghost: "text-gray-500 hover:text-gray-700",
  }
  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}