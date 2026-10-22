import { useCallback, useEffect, useState } from "react";
import { getConversations } from "../services/chatService.js";

/** Loads the conversation list with loading and error state. */
export function useChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setChats(await getConversations());
    } catch (err) {
      setError(err.message || "Unable to load conversations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadInitialChats() {
      try {
        const data = await getConversations();
        if (!cancelled) setChats(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load conversations.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadInitialChats();
    return () => { cancelled = true; };
  }, []);

  return { chats, setChats, loading, error, reload: load };
}
