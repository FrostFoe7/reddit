<?php
/**
 * Votes Route Handler
 */

$pdo = DB::connect();

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['user_id']) || empty($input['vote'])) {
        sendResponse(['error' => 'Missing required fields'], 400);
    }

    $type = $input['type'] ?? 'post'; // 'post' or 'comment'
    $target_id = $input['target_id'] ?? null;
    $vote = (int)$input['vote']; // 1, -1, or 0 (to remove)

    if (!$target_id) {
        sendResponse(['error' => 'Missing target_id'], 400);
    }

    try {
        $table = ($type === 'post') ? 'post_votes' : 'comment_votes';
        $column = ($type === 'post') ? 'post_id' : 'comment_id';

        if ($vote === 0) {
            // Remove vote
            $stmt = $pdo->prepare("DELETE FROM $table WHERE user_id = ? AND $column = ?");
            $stmt->execute([$input['user_id'], $target_id]);
        } else {
            // Upsert vote
            $stmt = $pdo->prepare("
                INSERT INTO $table (user_id, $column, vote) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE vote = VALUES(vote)
            ");
            $stmt->execute([$input['user_id'], $target_id, $vote]);
        }

        sendResponse(['success' => true]);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to process vote: ' . $e->getMessage()], 500);
    }
}
