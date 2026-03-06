<?php
/**
 * Database Configuration (PDO MySQL)
 * Optimized for both local development and cPanel hosting
 */

// --- CPANEL CONFIGURATION TIP ---
// On cPanel, your database name and user usually look like: 'cpaneluser_reddit_v2'
// Use '127.0.0.1' as DB_HOST if 'localhost' gives socket errors.

// define('DB_HOST', '127.0.0.1'); // Local development
// define('DB_NAME', 'reddit_v2');
// define('DB_USER', 'frostfoe');
// define('DB_PASS', 'frostfoe');
// define('DB_CHARSET', 'utf8mb4');

// --- CPANEL EXAMPLE (COMMENTED OUT) ---
define('DB_HOST', 'localhost'); // Local development
define('DB_NAME', 'breach_frm');
define('DB_USER', 'sysbdadm');
define('DB_PASS', 'nJ$#6F%JQiKj');
define('DB_CHARSET', 'utf8mb4');

class DB {
    private static $instance = null;

    public static function connect() {
        if (self::$instance === null) {
            try {
                // PDO with error mode exception and prepared statements for security
                $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ];
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (\PDOException $e) {
                header('Content-Type: application/json', true, 500);
                echo json_encode(['error' => 'Database connection failed. Please check your config/db.php settings.']);
                // Log actual error for sysadmin
                error_log("DB Connection Error: " . $e->getMessage());
                exit;
            }
        }
        return self::$instance;
    }
}
