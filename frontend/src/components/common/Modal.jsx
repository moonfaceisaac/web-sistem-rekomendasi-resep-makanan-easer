export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm text-gray-500 mb-1">{message}</p>
        <p className="font-bold text-gray-800 mb-5">{title}</p>
        <div className="flex justify-center gap-3">
          <button onClick={onCancel}
            className="border border-gray-300 text-gray-600 text-sm px-6 py-2 rounded-lg hover:bg-gray-100 transition">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="bg-gray-900 text-white text-sm px-6 py-2 rounded-lg hover:bg-red-600 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}