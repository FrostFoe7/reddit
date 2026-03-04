<?php
/**
 * Users Route Handler
 */

$pdo = DB::connect();

if ($method === 'GET') {
    // Fetch user by username if provided in query string
    $username = $_GET['username'] ?? null;
    
    if ($username) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendResponse(['error' => 'User not found'], 404);
        }
        
        sendResponse($user);
    } else {
        // List all users
        $stmt = $pdo->query("SELECT * FROM users LIMIT 10");
        sendResponse($stmt->fetchAll());
    }
}
