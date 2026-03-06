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
define('DB_PASS', 'sysbdadm1337');
define('DB_CHARSET', 'utf8mb4');

function dbEnv(string $key, string $default = ''): string {
    $value = getenv($key);
    return ($value === false || $value === null || $value === '') ? $default : (string)$value;
}

class DB {
    private static $instance = null;

    public static function connect() {
        if (self::$instance === null) {
            $dbName = dbEnv('DB_NAME', DB_NAME);
            $dbUser = dbEnv('DB_USER', DB_USER);
            $dbPass = dbEnv('DB_PASS', DB_PASS);
            $dbCharset = dbEnv('DB_CHARSET', DB_CHARSET);

            // Try multiple hosts for shared hosting compatibility.
            $hostsRaw = dbEnv('DB_HOSTS', '');
            $hosts = [];
            if ($hostsRaw !== '') {
                foreach (explode(',', $hostsRaw) as $host) {
                    $host = trim($host);
                    if ($host !== '') {
                        $hosts[] = $host;
                    }
                }
            }

            if (empty($hosts)) {
                $hostFromEnv = dbEnv('DB_HOST', DB_HOST);
                $hosts[] = $hostFromEnv;
                if ($hostFromEnv === 'localhost') {
                    $hosts[] = '127.0.0.1';
                }
            }

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $lastError = null;
            $triedHosts = [];

            foreach ($hosts as $host) {
                try {
                    $triedHosts[] = $host;
                    $dsn = "mysql:host=" . $host . ";dbname=" . $dbName . ";charset=" . $dbCharset;
                    self::$instance = new PDO($dsn, $dbUser, $dbPass, $options);
                    break;
                } catch (\PDOException $e) {
                    $lastError = $e;
                }
            }

            if (self::$instance === null) {
                header('Content-Type: application/json', true, 500);
                $error = 'Database connection failed. Please check your config/db.php settings.';

                if (isset($_GET['debug']) && $_GET['debug'] === '1' && $lastError) {
                    $error = 'Database connection failed: ' . $lastError->getMessage();
                }

                echo json_encode([
                    'error' => $error,
                    'context' => [
                        'db_name' => $dbName,
                        'db_user' => $dbUser,
                        'hosts_tried' => $triedHosts,
                    ],
                ]);

                if ($lastError) {
                    error_log('DB Connection Error: ' . $lastError->getMessage());
                }
                exit;
            }
        }
        return self::$instance;
    }
}
