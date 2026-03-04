<?php
/**
 * Auth Route Handler
 */

$pdo = DB::connect();

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Registration
    if (strpos($route, 'auth/register') === 0) {
        if (empty($input['username']) || empty($input['password']) || empty($input['email'])) {
            sendResponse(['error' => 'Missing required fields'], 400);
        }

        try {
            // Check if username already exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$input['username'], $input['email']]);
            if ($stmt->fetch()) {
                sendResponse(['error' => 'Username or Email already exists'], 400);
            }

            $id = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 3) . '-' . 
                  substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 3) . '-' . 
                  substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 3);
            
            $password_hash = password_hash($input['password'], PASSWORD_DEFAULT);
            $avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . $input['username'];

            $stmt = $pdo->prepare("
                INSERT INTO users (id, username, email, password_hash, avatar_url)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $id,
                $input['username'],
                $input['email'],
                $password_hash,
                $avatar_url
            ]);

            // Fetch created user
            $stmt = $pdo->prepare("SELECT id, username, email, avatar_url, karma, created_at FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch();

            sendResponse(['success' => true, 'user' => $user], 201);
        } catch (\Exception $e) {
            sendResponse(['error' => 'Registration failed: ' . $e->getMessage()], 500);
        }
    }

    // Login
    if (strpos($route, 'auth/login') === 0) {
        if (empty($input['username']) || empty($input['password'])) {
            sendResponse(['error' => 'Missing username or password'], 400);
        }

        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$input['username']]);
            $user = $stmt->fetch();

            if ($user && password_verify($input['password'], $user['password_hash'])) {
                // Remove password hash from response
                unset($user['password_hash']);
                sendResponse(['success' => true, 'user' => $user]);
            } else {
                sendResponse(['error' => 'Invalid username or password'], 401);
            }
        } catch (\Exception $e) {
            sendResponse(['error' => 'Login failed: ' . $e->getMessage()], 500);
        }
    }
}
