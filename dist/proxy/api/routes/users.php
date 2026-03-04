<?php
/**
 * Users Route Handler
 */

$pdo = DB::connect();

if ($method === 'GET') {
    // Fetch user by username if provided in query string
    $username = $_GET['username'] ?? null;
    $user_id = $_GET['user_id'] ?? null;

    // Fetch user memberships
    if (strpos($route, 'users/memberships') === 0) {
        if (!$user_id) {
            sendResponse(['error' => 'Missing user_id'], 400);
        }
        $stmt = $pdo->prepare("SELECT subreddit_id FROM subreddit_members WHERE user_id = ?");
        $stmt->execute([$user_id]);
        sendResponse($stmt->fetchAll(PDO::FETCH_COLUMN));
    }
    
    if ($username) {
        $stmt = $pdo->prepare("SELECT id, username, avatar_url, banner_url, bio, karma, cake_day, is_premium, is_verified, created_at FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendResponse(['error' => 'User not found'], 404);
        }
        
        sendResponse($user);
    } else {
        // List all users
        $stmt = $pdo->query("SELECT id, username, avatar_url, karma FROM users LIMIT 10");
        sendResponse($stmt->fetchAll());
    }
}
