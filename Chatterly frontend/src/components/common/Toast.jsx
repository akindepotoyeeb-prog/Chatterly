import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const ICONS = {
  success: <CheckCircle2 size={20} color="var(--accent)" />,
  error: <AlertCircle size={20} color="var(--danger)" />,
  info: <Info size={20} color="var(--info)" />,
};

/** Renders the live toast stack. Use the useToast() hook to add toasts. */
export default function ToastRegion({ toasts, onDismiss }) {
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {ICONS[t.type] ?? ICONS.info}
          <p className="toast-message">{t.message}</p>
          <button className="icon-btn" onClick={() => onDismiss(t.id)} aria-label="Dismiss notification">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
