export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="state">
      {icon && <span className="state-icon" aria-hidden="true">{icon}</span>}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
