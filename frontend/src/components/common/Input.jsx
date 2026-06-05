export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs text-gray-500">{label}</label>}
      <input
        {...props}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
      />
    </div>
  )
}