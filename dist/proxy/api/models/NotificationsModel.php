<?php
/**
 * Notifications Model
 * Database queries for notifications
 */

class NotificationsModel
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Fetch notifications for user
     */
    public function fetchNotifications(string $userId, int $limit = 50): array
    {
        $sql = "
            SELECT 
                n.*,
                u.username as actor_name,
                u.avatar_url as actor_avatar
            FROM notifications n
            LEFT JOIN users u ON n.actor_id = u.id
            WHERE n.recipient_id = :user_id
            ORDER BY n.created_at DESC
            LIMIT :limit
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, \PDO::PARAM_STR);
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Get unread notification count
     */
    public function getUnreadCount(string $userId): int
    {
        $sql = "
            SELECT COUNT(*) as count FROM notifications
            WHERE recipient_id = :user_id AND is_read = 0
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':user_id' => $userId]);
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        return (int)($result['count'] ?? 0);
    }

    /**
     * Create notification
     */
    public function createNotification(array $notificationData): void
    {
        $sql = "
            INSERT INTO notifications 
            (id, recipient_id, actor_id, type, target_id, text, is_read)
            VALUES (:id, :recipient_id, :actor_id, :type, :target_id, :text, 0)
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $notificationData['id'] ?? uniqid(),
            ':recipient_id' => $notificationData['recipient_id'],
            ':actor_id' => $notificationData['actor_id'] ?? null,
            ':type' => $notificationData['type'],
            ':target_id' => $notificationData['target_id'] ?? null,
            ':text' => $notificationData['text']
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(string $notificationId): void
    {
        $sql = "UPDATE notifications SET is_read = 1 WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $notificationId]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(string $userId): void
    {
        $sql = "UPDATE notifications SET is_read = 1 WHERE recipient_id = :user_id AND is_read = 0";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':user_id' => $userId]);
    }

    /**
     * Delete notification
     */
    public function deleteNotification(string $notificationId): void
    {
        $sql = "DELETE FROM notifications WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $notificationId]);
    }
}
