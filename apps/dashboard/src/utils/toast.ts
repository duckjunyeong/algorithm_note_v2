import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 300,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  className: 'custom-toast',
  style: {
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    minHeight: '48px',
    padding: '12px 16px'
  }
};

export const showSuccessToast = (message: string, options?: Partial<ToastOptions>) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      borderColor: '#22c55e',
      backgroundColor: '#f0fdf4'
    }
  });
};

export const showErrorToast = (message: string, options?: Partial<ToastOptions>) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      borderColor: '#ef4444',
      backgroundColor: '#fef2f2'
    }
  });
};

export const showInfoToast = (message: string, options?: Partial<ToastOptions>) => {
  return toast.info(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff'
    }
  });
};

export const showWarningToast = (message: string, options?: Partial<ToastOptions>) => {
  return toast.warn(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      borderColor: '#f59e0b',
      backgroundColor: '#fffbeb'
    }
  });
};