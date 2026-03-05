<?php
/**
 * Auth Model
 * Database queries for authentication
 */

class AuthModel
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Check if username or email exists
     */
    public function userExists(string $username, string $email): bool
    {
        $stmt = $this->pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        return (bool)$stmt->fetch();
    }

    /**
     * Create new user
     */
    public function createUser(array $userData): string
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO users (id, username, email, password_hash, avatar_url)
            VALUES (?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $userData['id'],
            $userData['username'],
            $userData['email'],
            $userData['password_hash'],
            $userData['avatar_url']
        ]);

        return $userData['id'];
    }

    /**
     * Fetch user by username
     */
    public function getUserByUsername(string $username): ?array
    {
        $stmt = $this->pdo->prepare("
            SELECT id, username, email, avatar_url, karma, created_at 
            FROM users 
            WHERE username = ?
        ");
        $stmt->execute([$username]);

        return $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
    }

    /**
     * Fetch user with password hash for auth
     */
    public function getUserWithPassword(string $username): ?array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);

        return $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
    }
}
