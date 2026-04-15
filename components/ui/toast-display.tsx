"use client";

// Imports
import { useToast } from "@/contexts/ToastContext";
import { X } from "lucide-react";

// Main Page
export function ToastDisplay() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed bottom-4 right-4 z-50 space-y-2"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {toasts.map((toast) => {
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            role={isError ? "alert" : "status"}
            aria-atomic="true"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-right-4 duration-200
              ${
                toast.type === "success"
                  ? "bg-green-50 text-green-900 border border-green-200"
                  : ""
              }
              ${
                toast.type === "error"
                  ? "bg-red-50 text-red-900 border border-red-200"
                  : ""
              }
              ${
                toast.type === "info"
                  ? "bg-blue-50 text-blue-900 border border-blue-200"
                  : ""
              }
            `}
          >
            {/* Message */}
            <span>{toast.message}</span>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="ml-2 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}