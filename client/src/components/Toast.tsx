import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = "success", duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const Icon = type === "success" ? CheckCircle : AlertCircle;
  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transform transition-transform duration-300",
        isVisible ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className={cn("text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3", bgColor)}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button onClick={handleClose} className="text-white/80 hover:text-white ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function useToastManager() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const addToast = (toast: Omit<ToastProps, "onClose">) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id, onClose: () => removeToast(id) }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string) => addToast({ message, type: "success" });
  const showError = (message: string) => addToast({ message, type: "error" });
  const showInfo = (message: string) => addToast({ message, type: "info" });

  return {
    toasts,
    showSuccess,
    showError,
    showInfo,
  };
}
