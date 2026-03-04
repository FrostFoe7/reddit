<?php
/**
 * Comments Route Handler
 */

$pdo = DB::connect();

if ($method === 'GET') {
    $post_id = $_GET['postId'] ?? $_GET['post_id'] ?? null;
    $user_id = $_GET['user_id'] ?? null;
    
    try {
        if ($post_id) {
            if ($user_id) {
                $stmt = $pdo->prepare("
                    SELECT cd.*, COALESCE(cv.vote, 0) as user_vote
                    FROM comment_details cd
                    LEFT JOIN comment_votes cv ON cd.id = cv.comment_id AND cv.user_id = ?
                    WHERE cd.post_id = ? 
                    ORDER BY cd.created_at ASC
                ");
                $stmt->execute([$user_id, $post_id]);
            } else {
                $stmt = $pdo->prepare("SELECT *, 0 as user_vote FROM comment_details WHERE post_id = ? ORDER BY created_at ASC");
                $stmt->execute([$post_id]);
            }
        } else {
            if ($user_id) {
                $stmt = $pdo->prepare("
                    SELECT cd.*, COALESCE(cv.vote, 0) as user_vote
                    FROM comment_details cd
                    LEFT JOIN comment_votes cv ON cd.id = cv.comment_id AND cv.user_id = ?
                    ORDER BY cd.created_at DESC LIMIT 50
                ");
                $stmt->execute([$user_id]);
            } else {
                $stmt = $pdo->query("SELECT *, 0 as user_vote FROM comment_details ORDER BY created_at DESC LIMIT 50");
            }
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
