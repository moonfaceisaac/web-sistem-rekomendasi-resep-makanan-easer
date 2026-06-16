export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs text-gray-500">{label}</label>}
      <input
        {...props}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white ${
          error
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-300 focus:ring-gray-400"
        } ${className}`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
