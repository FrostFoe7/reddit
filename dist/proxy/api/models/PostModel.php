<?php
/**
 * Post Model
 * Database queries for posts
 */

class PostModel
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Fetch posts with sorting and optional filtering
     */
    public function fetchPosts(
        ?string $userId = null,
        string $sort = 'new',
        ?string $searchQuery = null,
        int $limit = 50
    ): array {
        // Build ORDER BY clause
        $orderBy = match ($sort) {
            'top' => "pd.upvotes DESC, pd.created_at DESC",
            'hot' => "(pd.upvotes / (TIMESTAMPDIFF(HOUR, pd.created_at, NOW()) + 2)) DESC",
            default => "pd.created_at DESC"
        };

        $sql = "
            SELECT pd.*, COALESCE(pv.vote, 0) as user_vote
            FROM post_details pd
            LEFT JOIN post_votes pv ON pd.id = pv.post_id AND pv.user_id = :user_id
        ";

        $params = [':user_id' => $userId];

        if ($searchQuery) {
            $sql .= " WHERE pd.title LIKE :search OR pd.content LIKE :search ";
            $params[':search'] = '%' . $searchQuery . '%';
        }

        $sql .= " ORDER BY " . $orderBy . " LIMIT :limit";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, \PDO::PARAM_STR);
        if ($searchQuery) {
            $stmt->bindValue(':search', $params[':search'], \PDO::PARAM_STR);
        }
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Fetch post by ID
     */
    public function fetchPostById(string $postId, ?string $userId = null): ?array
    {
        $sql = "
            SELECT pd.*, COALESCE(pv.vote, 0) as user_vote
            FROM post_details pd
            LEFT JOIN post_votes pv ON pd.id = pv.post_id AND pv.user_id = :user_id
            WHERE pd.id = :id
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $postId,
            ':user_id' => $userId
        ]);

        return $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
    }

    /**
     * Create new post
     */
    public function createPost(array $postData): void
    {
        $sql = "
            INSERT INTO posts (id, author_id, subreddit_id, title, content, image_url, post_type)
            VALUES (:id, :author_id, :subreddit_id, :title, :content, :image_url, :post_type)
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $postData['id'],
            ':author_id' => $postData['author_id'],
            ':subreddit_id' => $postData['subreddit_id'],
            ':title' => $postData['title'],
            ':content' => $postData['content'] ?? null,
            ':image_url' => $postData['image_url'] ?? null,
            ':post_type' => $postData['post_type'] ?? 'text'
        ]);
    }
}
