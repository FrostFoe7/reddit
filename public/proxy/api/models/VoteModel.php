<?php
/**
 * Vote Model
 * Database queries for votes
 */

class VoteModel
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Record post vote
     */
    public function votePost(string $userId, string $postId, int $vote): void
    {
        $sql = "
            INSERT INTO post_votes (user_id, post_id, vote)
            VALUES (:user_id, :post_id, :vote)
            ON DUPLICATE KEY UPDATE vote = :vote
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':user_id' => $userId,
            ':post_id' => $postId,
            ':vote' => $vote
        ]);

        // Update post upvotes count
        $this->updatePostVoteCount($postId);
    }

    /**
     * Record comment vote
     */
    public function voteComment(string $userId, string $commentId, int $vote): void
    {
        $sql = "
            INSERT INTO comment_votes (user_id, comment_id, vote)
            VALUES (:user_id, :comment_id, :vote)
            ON DUPLICATE KEY UPDATE vote = :vote
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':user_id' => $userId,
            ':comment_id' => $commentId,
            ':vote' => $vote
        ]);

        // Update comment upvotes count
        $this->updateCommentVoteCount($commentId);
    }

    private function updatePostVoteCount(string $postId): void
    {
        $sql = "
            UPDATE posts 
            SET upvotes = (
                SELECT COUNT(CASE WHEN vote > 0 THEN 1 END) FROM post_votes 
                WHERE post_id = :post_id
            )
            WHERE id = :post_id
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':post_id' => $postId]);
    }

    private function updateCommentVoteCount(string $commentId): void
    {
        $sql = "
            UPDATE comments 
            SET upvotes = (
                SELECT COUNT(CASE WHEN vote > 0 THEN 1 END) FROM comment_votes 
                WHERE comment_id = :comment_id
            )
            WHERE id = :comment_id
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':comment_id' => $commentId]);
    }
}
