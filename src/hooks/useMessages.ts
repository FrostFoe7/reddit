import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useStore";
import type { Conversation, Message } from "@/types";

export function useConversations() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => api.get<Conversation[]>(`messages?user_id=${userId}`),
    enabled: !!userId,
  });
}

export function useMessages(conversationId: string | null) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["messages", conversationId, userId],
    queryFn: () => api.get<Message[]>(`messages?user_id=${userId}&conversation_id=${conversationId}`),
    enabled: !!userId && !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (variables: { conversation_id: string; content: string }) => {
      if (!user) throw new Error("Must be logged in");
      return api.post("messages", {
        ...variables,
        sender_id: user.id,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ["conversations", user?.id] });
    },
  });
}
