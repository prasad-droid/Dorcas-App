import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[3000] w-[90%] max-w-[350px] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${
                toast.type === "success"
                  ? "bg-green-50 border-green-100 text-green-800"
                  : toast.type === "error"
                  ? "bg-red-50 border-red-100 text-red-800"
                  : "bg-blue-50 border-blue-100 text-blue-800"
              }`}
            >
              <div className="shrink-0">
                {toast.type === "success" && <CheckCircle size={20} className="text-green-600" />}
                {toast.type === "error" && <AlertCircle size={20} className="text-red-600" />}
                {toast.type === "info" && <Info size={20} className="text-blue-600" />}
              </div>
              <p className="text-sm font-medium flex-1 leading-tight">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={16} className="opacity-50" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
