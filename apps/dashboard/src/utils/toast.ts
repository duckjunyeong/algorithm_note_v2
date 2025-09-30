import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 1000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  className: 'custom-toast',
  style: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
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
      borderLeft: '4px solid #22c55e'
    }
  });
};

export const showErrorToast = (message: string, options?: Partial<ToastOptions>) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      borderLeft: '4px solid #ef4444'
    }
  });
};

export const showInfoToast = (message: string, options?: Partial<ToastOptions>) => {
  return toast.info(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      borderLeft: '4px solid #3b82f6'
    }
  });
};

export const showWarningToast = (message: string, options?: Partial<ToastOptions>) => {
  return toast.warn(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      borderLeft: '4px solid #f59e0b'
    }
  });
};