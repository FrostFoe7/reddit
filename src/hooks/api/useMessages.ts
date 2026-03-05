import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "@/api/client";
import { useAuthStore } from "@/store/useStore";
import type { Message } from "@/types";
import { normalizeConversation } from "@/types/normalize";
import { toast } from "sonner";

/**
 * Fetch user's conversations
 */
export function useConversations() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");
      const data = await api.get<Record<string, unknown>[]>(`messages?user_id=${userId}`);
      return data.map(normalizeConversation);
    },
    enabled: !!userId,
    retry: 2,
    staleTime: 30000,
    refetchInterval: 60000, // Poll every minute
  });
}

/**
 * Fetch messages in a conversation
 */
export function useMessages(conversationId: string | null) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["messages", conversationId, userId],
    queryFn: async () => {
      if (!userId || !conversationId) throw new Error("User ID and conversation ID required");
      const params = new URLSearchParams({ 
        user_id: userId,
        conversation_id: conversationId 
      });
      const data = await api.get<Record<string, unknown>[]>(`messages?${params.toString()}`);
      return (data as unknown as Message[]) || [];
    },
    enabled: !!userId && !!conversationId,
    retry: 2,
    staleTime: 15000,
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

/**
 * Send message in a conversation
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (variables: { conversation_id: string; content: string }) => {
      if (!user) throw new Error("Must be logged in");
      return api.post("messages", {
        ...variables,
        sender_id: user.id,
      }, { timeout: 15000 });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ["conversations", user?.id] });
      toast.success("Message sent");
    },
    onError: (error: ApiError) => {
      console.error("Send message error:", error);
      toast.error(error.message || "Failed to send message");
    },
  });
}
