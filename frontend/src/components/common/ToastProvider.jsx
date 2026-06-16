import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "../../context/toastContext";

function ToastItem({ toast, onClose }) {
  const toneClasses = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-gray-800",
  };

  return (
    <div
      className={`${toneClasses[toast.type] || toneClasses.info} text-white px-4 py-3 rounded-lg shadow-lg min-w-[260px] max-w-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm leading-5">{toast.message}</p>
        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className="text-white/80 hover:text-white text-xs"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((message, type = "info") => {
    const id = `${Date.now()}-${Math.random()}`;

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const api = useMemo(
    () => ({
      show: (message) => pushToast(message, "info"),
      success: (message) => pushToast(message, "success"),
      error: (message) => pushToast(message, "error"),
    }),
    [pushToast],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
