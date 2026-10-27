import { Archive, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorkspacePage from "./WorkspacePage.jsx";
export default function ArchivedPage() {
  const nav = useNavigate();
  return (
    <WorkspacePage
      title="Archived chats"
      subtitle="Conversations moved out of your main inbox"
      active="/app/archived"
    >
      <div className="workspace-card workspace-empty">
        <Archive size={27} />
        <h2>No archived chats yet</h2>
        <p>
          Chat archiving will appear here after the archive service is connected
          to your backend.
        </p>
        <button className="primary-action" onClick={() => nav("/app")}>
          <MessageCircle size={16} /> Return to chats
        </button>
      </div>
    </WorkspacePage>
  );
}
