'use client';

import { useToast } from '@/contexts/ToastContext';
import { Check, AlertCircle, Info, X } from 'lucide-react';

export function ToastDisplay() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-right-4 duration-200 ${
            toast.type === 'success' ? 'bg-green-50 text-green-900 border border-green-200' : ''
          } ${toast.type === 'error' ? 'bg-red-50 text-red-900 border border-red-200' : ''} ${
            toast.type === 'info' ? 'bg-blue-50 text-blue-900 border border-blue-200' : ''
          }`}
        >
          <div>
            {toast.type === 'success' && <Check className="w-4 h-4" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {toast.type === 'info' && <Info className="w-4 h-4" />}
          </div>
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
