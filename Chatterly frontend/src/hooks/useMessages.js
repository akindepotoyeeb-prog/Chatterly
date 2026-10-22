import { useCallback, useEffect, useRef, useState } from "react";
import { getMessages } from "../services/messageService.js";

/** Loads messages for one conversation; ignores responses for chats already left. */
export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(Boolean(conversationId));
  const [error, setError] = useState(null);
  const latest = useRef(0);

  const load = useCallback(async () => {
    const ticket = ++latest.current;
    if (!conversationId) {
      setMessages([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getMessages(conversationId);
      if (ticket === latest.current) setMessages(data);
    } catch (err) {
      if (ticket === latest.current) setError(err.message || "Unable to load messages.");
    } finally {
      if (ticket === latest.current) setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    const ticket = ++latest.current;
    let cancelled = false;
    async function loadInitialMessages() {
      await Promise.resolve();
      if (cancelled || ticket !== latest.current) return;
      setLoading(Boolean(conversationId));
      setError(null);
      if (!conversationId) {
        setMessages([]);
        setLoading(false);
        return;
      }
      try {
        const data = await getMessages(conversationId);
        if (!cancelled && ticket === latest.current) setMessages(data);
      } catch (err) {
        if (!cancelled && ticket === latest.current) setError(err.message || "Unable to load messages.");
      } finally {
        if (!cancelled && ticket === latest.current) setLoading(false);
      }
    }
    void loadInitialMessages();
    return () => { cancelled = true; };
  }, [conversationId]);

  return { messages, setMessages, loading, error, reload: load };
}
