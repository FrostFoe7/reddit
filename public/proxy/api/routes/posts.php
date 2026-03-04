<?php
/**
 * Posts Route Handler
 */

$pdo = DB::connect();

// Handle GET requests (Fetch posts)
if ($method === 'GET') {
    try {
        // Use the pre-built view for complete post data including counts
        $stmt = $pdo->prepare("SELECT * FROM post_details ORDER BY created_at DESC LIMIT 20");
        $stmt->execute();
        $posts = $stmt->fetchAll();
        
        sendResponse($posts);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to fetch posts: ' . $e->getMessage()], 500);
    }
}

// Handle POST requests (Create a new post)
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Simple validation
    if (empty($input['id']) || empty($input['title'])) {
        sendResponse(['error' => 'Missing required fields: id and title'], 400);
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO posts (id, author_id, subreddit_id, title, content, post_type)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['id'],
            $input['author_id'],
            $input['subreddit_id'],
            $input['title'],
            $input['content'] ?? null,
            $input['post_type'] ?? 'text'
        ]);

        sendResponse(['success' => true, 'id' => $input['id']], 201);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to create post: ' . $e->getMessage()], 500);
    }
}
