import { createContext, useContext, useMemo, useState } from "react";

/*
 * Shared UI state for the messaging screens. Phase 3 will add the selected
 * conversation's data; for now it tracks which conversation is open and whether
 * the mobile layout shows the list or the chat.
 */
const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [activeChatId, setActiveChatId] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat"

  const value = useMemo(() => ({
    activeChatId,
    mobileView,
    openChat: (id) => { setActiveChatId(id); setMobileView("chat"); },
    closeChat: () => setMobileView("list"),
  }), [activeChatId, mobileView]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Context modules intentionally export both their provider and matching hook.
// eslint-disable-next-line react-refresh/only-export-components
export function useChatUI() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatUI must be used inside <ChatProvider>");
  return ctx;
}
