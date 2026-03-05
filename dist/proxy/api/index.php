<?php
/**
 * API Bootstrap
 * Sets up error handling, security headers, and routes requests
 */

// 1. Error Logging Configuration
error_reporting(E_ALL);
ini_set('display_errors', 0); // Hide in production
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../logs/error.log');

// 2. Security & CORS Headers
header("Access-Control-Allow-Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. Load core components and router
try {
    require_once __DIR__ . '/../config/db.php';
    require_once __DIR__ . '/router.php';
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Application error']);
    error_log('Bootstrap error: ' . $e->getMessage());
}

