<?php
/**
 * Community Model
 * Database queries for communities/subreddits
 */

class CommunityModel
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Fetch all communities with member counts
     */
    public function fetchCommunities(?string $searchQuery = null, int $limit = 50): array
    {
        $sql = "
            SELECT 
                s.*,
                COUNT(DISTINCT sm.user_id) as members,
                COUNT(DISTINCT p.id) as post_count
            FROM subreddits s
            LEFT JOIN subreddit_members sm ON s.id = sm.subreddit_id
            LEFT JOIN posts p ON s.id = p.subreddit_id
        ";

        $params = [];

        if ($searchQuery) {
            $sql .= " WHERE s.name LIKE :search OR s.description LIKE :search ";
            $params[':search'] = '%' . $searchQuery . '%';
        }

        $sql .= " GROUP BY s.id ORDER BY members DESC LIMIT :limit";

        $stmt = $this->pdo->prepare($sql);
        if ($searchQuery) {
            $stmt->bindValue(':search', $params[':search'], \PDO::PARAM_STR);
        }
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Fetch community by ID or name
     */
    public function fetchCommunity(string $idOrName, ?string $userId = null): ?array
    {
        $sql = "
            SELECT 
                s.*,
                COUNT(DISTINCT sm.user_id) as members,
                COUNT(DISTINCT p.id) as post_count,
                MAX(CASE WHEN sm.user_id = :user_id THEN 1 ELSE 0 END) as is_joined,
                MAX(CASE WHEN sm.user_id = :user_id THEN sm.role ELSE NULL END) as current_user_role
            FROM subreddits s
            LEFT JOIN subreddit_members sm ON s.id = sm.subreddit_id
            LEFT JOIN posts p ON s.id = p.subreddit_id
            WHERE s.id = :id OR s.name = :name
            GROUP BY s.id
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $idOrName,
            ':name' => $idOrName,
            ':user_id' => $userId
        ]);

        return $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
    }

    /**
     * Create new community
     */
    public function createCommunity(array $communityData): void
    {
        $sql = "
            INSERT INTO subreddits (id, name, description, icon_url, banner_url, creator_id, owner_id)
            VALUES (:id, :name, :description, :icon_url, :banner_url, :creator_id, :owner_id)
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $communityData['id'] ?? uniqid(),
            ':name' => $communityData['name'],
            ':description' => $communityData['description'] ?? null,
            ':icon_url' => $communityData['icon_url'] ?? null,
            ':banner_url' => $communityData['banner_url'] ?? null,
            ':creator_id' => $communityData['creator_id'] ?? $communityData['owner_id'] ?? null,
            ':owner_id' => $communityData['owner_id'] ?? $communityData['creator_id'] ?? null,
        ]);
    }

    /**
     * Join community
     */
    public function joinCommunity(string $communityId, string $userId): void
    {
        $sql = "
            INSERT INTO subreddit_members (subreddit_id, user_id) 
            VALUES (:subreddit_id, :user_id)
            ON DUPLICATE KEY UPDATE role = role
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':subreddit_id' => $communityId,
            ':user_id' => $userId
        ]);
    }

    /**
     * Leave community
     */
    public function leaveCommunity(string $communityId, string $userId): void
    {
        $sql = "DELETE FROM subreddit_members WHERE subreddit_id = :subreddit_id AND user_id = :user_id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':subreddit_id' => $communityId,
            ':user_id' => $userId
        ]);
    }

    /**
     * Delete community.
     */
    public function deleteCommunity(string $communityId): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM subreddits WHERE id = :id');
        $stmt->execute([':id' => $communityId]);
    }

    /**
     * Fetch membership role in a community.
     */
    public function getMembershipRole(string $communityId, string $userId): ?string
    {
        $stmt = $this->pdo->prepare('SELECT role FROM subreddit_members WHERE subreddit_id = :subreddit_id AND user_id = :user_id LIMIT 1');
        $stmt->execute([
            ':subreddit_id' => $communityId,
            ':user_id' => $userId,
        ]);
        $role = $stmt->fetchColumn();
        return $role ? (string)$role : null;
    }

    /**
     * Get user's community memberships
     */
    public function getUserMemberships(string $userId): array
    {
        $sql = "
            SELECT s.id
            FROM subreddits s
            INNER JOIN subreddit_members sm ON s.id = sm.subreddit_id
            WHERE sm.user_id = :user_id
            ORDER BY s.name
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':user_id' => $userId]);

        $results = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        return array_map(fn($row) => $row['id'], $results);
    }
}
