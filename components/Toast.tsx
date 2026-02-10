import { useEffect } from "react";

interface ToastProps {
  text?: string;
  /** 자동으로 닫히는 시간(ms). 지정하지 않으면 자동으로 닫히지 않음 */
  duration?: number;
  /** duration 이후에 호출되는 콜백 (예: setToastVisible(false)) */
  onClose?: () => void;
  className?: string;
}

export function Toast({
  text = "열심히 만들고 있어요! 곧 오픈됩니다 🚧",
  duration = 2000,
  onClose,
  className = ""
}: ToastProps) {
  useEffect(() => {
    if (!duration || !onClose) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={
        "fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-lg bg-gray-700 text-white text-sm font-medium shadow-lg animate-in fade-in duration-200 " +
        className
      }
      role="status"
      aria-live="polite"
    >
      {text}
    </div>
  );
}
