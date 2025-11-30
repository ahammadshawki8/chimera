import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    
    // Auto-remove after duration
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// Helper functions for easy toast creation
export const toast = {
  success: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'error', title, message }),
  warning: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'warning', title, message }),
  info: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'info', title, message }),
};

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-neon-green/10',
    borderColor: 'border-neon-green',
    iconColor: 'text-neon-green',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500',
    iconColor: 'text-yellow-500',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-500',
  },
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast: t, onRemove }) => {
  const config = toastConfig[t.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-start gap-3 p-4 min-w-[300px] max-w-[400px]
        ${config.bgColor} border-2 ${config.borderColor}
        backdrop-blur-sm shadow-lg angular-frame
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="font-cyber font-bold text-white text-sm">{t.title}</p>
        {t.message && (
          <p className="text-gray-400 text-xs mt-1 whitespace-pre-line">{t.message}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="text-gray-500 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
