import { useMemo, useState } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import WorkspacePage from "./WorkspacePage.jsx";
import {
  sampleNotifications,
  filterNotifications,
} from "../script/notificationsPage.js";
import { useToast } from "../context/ToastContext.jsx";
export default function NotificationsPage() {
  const [items, setItems] = useState(sampleNotifications),
    [unreadOnly, setUnreadOnly] = useState(false);
  const toast = useToast(),
    visible = useMemo(
      () => filterNotifications(items, unreadOnly),
      [items, unreadOnly],
    ),
    unread = items.filter((n) => !n.read).length;
  return (
    <WorkspacePage
      title="Notifications"
      subtitle="Updates and activity from your workspace"
      active="/app/notifications"
      actions={
        <button
          className="secondary-action"
          onClick={() => {
            setItems((p) => p.map((n) => ({ ...n, read: true })));
            toast.showToast("All notifications marked as read.", "success");
          }}
        >
          <CheckCheck size={17} /> Mark all read
        </button>
      }
    >
      <div className="workspace-card notification-summary">
        <Bell />
        <strong>{unread} unread updates</strong>
      </div>
      <div className="segmented-filter">
        <button
          className={!unreadOnly ? "selected" : ""}
          onClick={() => setUnreadOnly(false)}
        >
          All activity
        </button>
        <button
          className={unreadOnly ? "selected" : ""}
          onClick={() => setUnreadOnly(true)}
        >
          Unread
        </button>
      </div>
      <div className="notification-list">
        {visible.map((n) => (
          <article
            className={`workspace-card notification-item ${n.read ? "is-read" : "is-unread"}`}
            key={n.id}
          >
            <div className="notification-icon">
              <Bell size={18} />
            </div>
            <div className="notification-copy">
              <div className="notification-title-line">
                <h2>{n.title}</h2>
                <span>{n.time}</span>
              </div>
              <p>{n.body}</p>
            </div>
            {!n.read && (
              <button
                className="text-action"
                onClick={() =>
                  setItems((p) =>
                    p.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                  )
                }
              >
                Mark read
              </button>
            )}
          </article>
        ))}
        {!visible.length && (
          <div className="workspace-empty">
            <Inbox />
            <h2>You're all caught up</h2>
          </div>
        )}
      </div>
    </WorkspacePage>
  );
}
