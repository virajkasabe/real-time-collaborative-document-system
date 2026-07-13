
import { useCallback, useState } from "react";
import { TOAST_DURATION_MS } from "../utils/editingpage.helper";

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const toastId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => dismissToast(toastId), TOAST_DURATION_MS);
  }, [dismissToast]);

  return { toasts, showToast, dismissToast };
}