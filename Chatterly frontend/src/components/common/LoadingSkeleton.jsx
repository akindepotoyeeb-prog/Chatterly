/** Placeholder rows shown while data loads. Mimics a conversation list item. */
export default function LoadingSkeleton({ rows = 4 }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      {Array.from({ length: rows }, (_, i) => (
        <div className="skeleton-row" key={i}>
          <span className="skeleton" style={{ width: 44, height: 44, borderRadius: "50%" }} />
          <div className="skeleton-lines">
            <span className="skeleton" style={{ height: 12, width: "45%" }} />
            <span className="skeleton" style={{ height: 10, width: "80%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
