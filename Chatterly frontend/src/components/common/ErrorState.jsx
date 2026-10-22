import { AlertTriangle, RotateCw } from "lucide-react";

export default function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="state state-error" role="alert">
      <span className="state-icon" aria-hidden="true"><AlertTriangle size={26} /></span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {onRetry && (
        <button className="btn btn-ghost" onClick={onRetry}>
          <RotateCw size={16} /> Try again
        </button>
      )}
    </div>
  );
}
