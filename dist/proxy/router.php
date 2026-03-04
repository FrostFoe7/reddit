<?php
/**
 * Local Development Router for PHP built-in server
 * Emulates Apache .htaccess behavior
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $uri;

// 1. If file or directory exists, serve it
if ($uri !== '/' && (file_exists($file) || file_exists($file . '/index.php'))) {
    return false;
}

// 2. Route all /api requests to index.php
if (strpos($uri, '/api') === 0) {
    $_SERVER['SCRIPT_NAME'] = '/api/index.php';
    require_once __DIR__ . '/api/index.php';
    exit;
}

// 3. Otherwise return 404
http_response_code(404);
echo "404 Not Found";
