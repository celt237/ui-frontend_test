import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

/**
 * Toast component - Displays temporary notification messages
 * 
 * Shows a toast notification that automatically closes after the specified duration.
 * Supports success, error, and info types with different background colors.
 * 
 * @param message - The message to display in the toast
 * @param type - The type of toast (success, error, or info)
 * @param onClose - Callback function called when the toast is closed
 * @param duration - Duration in milliseconds before auto-closing (default: 3000ms)
 */
const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]); // onClose is intentionally omitted as it's typically stable from parent

  const bgColor = {
    success: 'bg-green-500 dark:bg-green-600',
    error: 'bg-red-500 dark:bg-red-600',
    info: 'bg-blue-500 dark:bg-blue-600',
  }[type];

  return (
    <div
      className={`fixed top-3 sm:top-4 right-3 sm:right-4 left-3 sm:left-auto max-w-sm sm:max-w-md ${bgColor} text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-lg z-50 animate-slide-in`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm sm:text-base flex-1 break-words">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 sm:ml-4 text-white hover:text-gray-200 font-bold text-lg sm:text-xl flex-shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;

