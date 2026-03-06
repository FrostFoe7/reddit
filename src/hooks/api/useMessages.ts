import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '@/services/api/messages';
import { queryKeys } from '@/services/query/keys';
import { useAuthStore } from '@/store/useStore';
import { toast } from 'sonner';

/**
 * Fetch user's conversations
 */
export function useConversations() {
  const user = useAuthStore(state => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.messages.conversations(userId),
    queryFn: () => messagesApi.getConversations(userId!),
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
  const user = useAuthStore(state => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.messages.conversation(conversationId),
    queryFn: () => {
      if (!conversationId) throw new Error('Conversation ID required');
      return messagesApi.getMessages(conversationId, userId!);
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
  const user = useAuthStore(state => state.user);
  const userId = user?.id;

  return useMutation({
    mutationFn: async (variables: { conversation_id: string; content: string }) => {
      if (!user) throw new Error('Must be logged in');
      return messagesApi.sendMessage(variables.conversation_id, variables.content, user.id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversation(variables.conversation_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations(userId) });
      toast.success('Message sent');
    },
    onError: (error: Error) => {
      console.error('Send message error:', error);
      toast.error(error.message || 'Failed to send message');
    },
  });
}
