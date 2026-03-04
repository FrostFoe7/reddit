<?php
/**
 * Database Configuration (PDO MySQL)
 * Secure, production-ready connectivity for cPanel
 */

// 1. Connection settings
// Tip: On cPanel, use your full database/username (e.g., 'yourcuser_reddit_v2')
define('DB_HOST', 'localhost');
define('DB_NAME', 'youruser_reddit_v2');
define('DB_USER', 'youruser_reddit_v2_user');
define('DB_PASS', 'your_secure_password_here');
define('DB_CHARSET', 'utf8mb4');

// 2. PDO Instance (Singleton pattern)
class DB {
    private static $instance = null;

    public static function connect() {
        if (self::$instance === null) {
            try {
                $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
                $options = [
                    PDO::ATTR_ERR_MODE            => PDO::ERR_MODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ];
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (\PDOException $e) {
                // Return a clean error message for API
                header('Content-Type: application/json', true, 500);
                echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
                exit;
            }
        }
        return self::$instance;
    }
}
