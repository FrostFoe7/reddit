<?php
/**
 * Comments Route Handler
 */

$pdo = DB::connect();

if ($method === 'GET') {
    $post_id = $_GET['postId'] ?? $_GET['post_id'] ?? null;
    
    try {
        if ($post_id) {
            $stmt = $pdo->prepare("SELECT * FROM comment_details WHERE post_id = ? ORDER BY created_at ASC");
            $stmt->execute([$post_id]);
        } else {
            $stmt = $pdo->query("SELECT * FROM comment_details ORDER BY created_at DESC LIMIT 50");
        }
        $comments = $stmt->fetchAll();
        sendResponse($comments);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to fetch comments: ' . $e->getMessage()], 500);
    }
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id']) || empty($input['post_id']) || empty($input['author_id']) || empty($input['content'])) {
        sendResponse(['error' => 'Missing required fields'], 400);
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO comments (id, post_id, author_id, parent_id, content)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['id'],
            $input['post_id'],
            $input['author_id'],
            $input['parent_id'] ?? null,
            $input['content']
        ]);

        sendResponse(['success' => true, 'id' => $input['id']], 201);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to create comment: ' . $e->getMessage()], 500);
    }
}
