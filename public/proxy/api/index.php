<?php
/**
 * API Bootstrap & Router (Single Entry Point)
 * Lightweight, production-optimized for cPanel
 */

// 1. Enable Error Logging for production
error_reporting(E_ALL);
ini_set('display_errors', 0); // Hide in prod for security
ini_set('log_errors', 1);

// 2. Security & CORS Headers
header("Access-Control-Allow-Origin: *"); // For production, specify your domain
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. Load Core Components
require_once __DIR__ . '/../config/db.php';

// 4. Flexible API Router
// Extract the route from the URL (handles /api/posts, /proxy/api/posts, etc.)
$request_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Strip leading prefixes to get the endpoint (e.g., 'posts')
$route = preg_replace('/^.*\/api\//', '', $request_path);
$method = $_SERVER['REQUEST_METHOD'];

// Function to handle the response
function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// 5. Basic Route Mapping
if (strpos($route, 'posts') === 0) {
    require_once __DIR__ . '/routes/posts.php';
} elseif (strpos($route, 'auth') === 0) {
    require_once __DIR__ . '/routes/auth.php';
} elseif (strpos($route, 'users') === 0) {
    require_once __DIR__ . '/routes/users.php';
} elseif (strpos($route, 'communities') === 0) {
    require_once __DIR__ . '/routes/communities.php';
} elseif (strpos($route, 'comments') === 0) {
    require_once __DIR__ . '/routes/comments.php';
} elseif (strpos($route, 'notifications') === 0) {
    require_once __DIR__ . '/routes/notifications.php';
} elseif ($route === 'status') {
    sendResponse(['status' => 'online', 'timestamp' => date('Y-m-d H:i:s')]);
} else {
    sendResponse(['error' => 'Endpoint not found: ' . $route], 404);
}
