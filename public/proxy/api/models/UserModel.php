<?php
/**
 * User Model
 * Database queries for users
 */

class UserModel
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Fetch all users
     */
    public function fetchAllUsers(int $limit = 10): array
    {
        $stmt = $this->pdo->prepare("
            SELECT id, username, avatar_url, karma 
            FROM users 
            LIMIT :limit
        ");
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Fetch user by ID
     */
    public function fetchUserById(string $userId): ?array
    {
        $stmt = $this->pdo->prepare("
            SELECT id, username, email, avatar_url, karma, created_at 
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$userId]);

        return $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
    }

    /**
     * Fetch user by username
     */
    public function fetchUserByUsername(string $username): ?array
    {
        $stmt = $this->pdo->prepare("
            SELECT id, username, email, avatar_url, karma, created_at 
            FROM users 
            WHERE username = ?
        ");
        $stmt->execute([$username]);

        return $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
    }
}
