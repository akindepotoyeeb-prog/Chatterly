const COLORS = ["#0e7490", "#047857", "#4d7c0f", "#b45309", "#be185d", "#6d28d9", "#1d4ed8", "#b91c1c"];

function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Round avatar with a deterministic colour and optional online dot. */
export default function Avatar({ name = "", src, size = "md", online }) {
  const style = { background: COLORS[hash(name) % COLORS.length] };
  return (
    <span className={`avatar avatar-${size}`} style={src ? undefined : style} role="img" aria-label={name}>
      {src ? <img src={src} alt="" /> : initials(name)}
      {online !== undefined && (
        <span
          className="avatar-status"
          style={online ? undefined : { background: "var(--text-muted)" }}
          title={online ? "Online" : "Offline"}
        />
      )}
    </span>
  );
}
