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

// 4. Simple API Router
// Extract the route from the URL (e.g., /backend/api/posts)
$request_uri = $_SERVER['REQUEST_URI'];
$base_path = '/backend/api/';
$route = str_replace($base_path, '', parse_url($request_uri, PHP_URL_PATH));
$method = $_SERVER['REQUEST_METHOD'];

// Function to handle the response
function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// 5. Basic Route Mapping
switch ($route) {
    case 'posts':
        // Include post-related logic or routes
        require_once __DIR__ . '/routes/posts.php';
        break;
        
    case 'users':
        require_once __DIR__ . '/routes/users.php';
        break;

    case 'status':
        sendResponse(['status' => 'online', 'timestamp' => date('Y-m-d H:i:s')]);
        break;

    default:
        sendResponse(['error' => 'Endpoint not found: ' . $route], 404);
        break;
}
