<?php
/**
 * Messages Model
 * Database queries for conversations and messages
 */

class MessagesModel
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Fetch conversations for user
     */
    public function fetchConversations(string $userId, int $limit = 50): array
    {
        $sql = "
            SELECT 
                c.*,
                u.username as other_user_name,
                u.avatar_url as other_user_avatar,
                (SELECT m.content FROM messages m 
                 WHERE m.conversation_id = c.id 
                 ORDER BY m.created_at DESC LIMIT 1) as last_message,
                (SELECT m.created_at FROM messages m 
                 WHERE m.conversation_id = c.id 
                 ORDER BY m.created_at DESC LIMIT 1) as last_message_at,
                COUNT(CASE WHEN m.recipient_id = :user_id AND m.is_read = 0 THEN 1 END) as unread_count
            FROM conversations c
            LEFT JOIN users u ON (c.user_1_id = :user_id AND c.user_2_id = u.id) 
                              OR (c.user_2_id = :user_id AND c.user_1_id = u.id)
            LEFT JOIN messages m ON c.id = m.conversation_id
            WHERE c.user_1_id = :user_id OR c.user_2_id = :user_id
            GROUP BY c.id
            ORDER BY last_message_at DESC
            LIMIT :limit
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, \PDO::PARAM_STR);
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Fetch messages for conversation
     */
    public function fetchMessages(string $conversationId, int $limit = 50): array
    {
        $sql = "
            SELECT 
                m.*,
                u.username as sender_name,
                u.avatar_url as sender_avatar
            FROM messages m
            LEFT JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = :conversation_id
            ORDER BY m.created_at DESC
            LIMIT :limit
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':conversation_id', $conversationId, \PDO::PARAM_STR);
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Send message
     */
    public function sendMessage(array $messageData): void
    {
        $sql = "
            INSERT INTO messages (id, conversation_id, sender_id, recipient_id, content, is_read)
            VALUES (:id, :conversation_id, :sender_id, :recipient_id, :content, 0)
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $messageData['id'] ?? uniqid(),
            ':conversation_id' => $messageData['conversation_id'],
            ':sender_id' => $messageData['sender_id'],
            ':recipient_id' => $messageData['recipient_id'],
            ':content' => $messageData['content']
        ]);
    }

    /**
     * Create conversation
     */
    public function createConversation(string $userId, string $otherUserId): ?array
    {
        $conversationId = uniqid();

        $sql = "
            INSERT INTO conversations (id, user_1_id, user_2_id)
            VALUES (:id, :user_1_id, :user_2_id)
            ON DUPLICATE KEY UPDATE id = id
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $conversationId,
            ':user_1_id' => min($userId, $otherUserId),
            ':user_2_id' => max($userId, $otherUserId)
        ]);

        return $this->fetchConversationByUsers($userId, $otherUserId);
    }

    /**
     * Get conversation by two users
     */
    public function fetchConversationByUsers(string $user1Id, string $user2Id): ?array
    {
        $sql = "
            SELECT c.* FROM conversations c
            WHERE (c.user_1_id = :user_1_id AND c.user_2_id = :user_2_id)
               OR (c.user_1_id = :user_2_id AND c.user_2_id = :user_1_id)
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':user_1_id' => $user1Id,
            ':user_2_id' => $user2Id
        ]);

        return $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
    }

    /**
     * Mark message as read
     */
    public function markAsRead(string $messageId): void
    {
        $sql = "UPDATE messages SET is_read = 1 WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $messageId]);
    }

    /**
     * Mark all messages in conversation as read
     */
    public function markConversationAsRead(string $conversationId, string $userId): void
    {
        $sql = "
            UPDATE messages 
            SET is_read = 1 
            WHERE conversation_id = :conversation_id AND recipient_id = :user_id
        ";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':conversation_id' => $conversationId,
            ':user_id' => $userId
        ]);
    }
}
