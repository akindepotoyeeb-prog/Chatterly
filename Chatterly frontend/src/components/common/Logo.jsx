import { MessagesSquare } from "lucide-react";

export default function Logo({ showName = true }) {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">
        <MessagesSquare size={22} strokeWidth={2.2} />
      </span>

      {showName && (
        <span className="brand-name">Chatterly</span>
      )}
    </div>
  );
}