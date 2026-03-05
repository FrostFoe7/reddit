<?php
/**
 * Comment Model
 * Database queries for comments
 */

class CommentModel
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Fetch comments for a post
     */
    public function fetchCommentsByPost(string $postId, ?string $userId = null): array
    {
        $sql = "
            SELECT c.*, COALESCE(cv.vote, 0) as user_vote
            FROM comments c
            LEFT JOIN comment_votes cv ON c.id = cv.comment_id AND cv.user_id = :user_id
            WHERE c.post_id = :post_id
            ORDER BY c.created_at DESC
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':post_id' => $postId,
            ':user_id' => $userId
        ]);

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Create new comment
     */
    public function createComment(array $commentData): void
    {
        $sql = "
            INSERT INTO comments (id, post_id, author_id, parent_id, content)
            VALUES (:id, :post_id, :author_id, :parent_id, :content)
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':id' => $commentData['id'],
            ':post_id' => $commentData['post_id'],
            ':author_id' => $commentData['author_id'],
            ':parent_id' => $commentData['parent_id'] ?? null,
            ':content' => $commentData['content']
        ]);
    }
}
