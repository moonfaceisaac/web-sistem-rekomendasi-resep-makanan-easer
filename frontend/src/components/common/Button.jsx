export default function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled = false,
  ...props
}) {
  const base = "w-full rounded-lg py-2.5 text-sm font-semibold transition";
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-700",
    ghost: "text-gray-500 hover:text-gray-700",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className} ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
