<?php
/**
 * Votes Route Handler
 */

$pdo = DB::connect();
require_once __DIR__ . '/../lib/auth.php';

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $authUserId = requireAuthenticatedUserId($input);
    
    if (empty($input['vote']) || empty($input['target_id'])) {
        sendResponse(['error' => 'Missing required fields'], 400);
    }

    $type = $input['type'] ?? 'post'; // 'post' or 'comment'
    $target_id = $input['target_id'];
    $vote = (int)$input['vote']; // 1, -1, or 0 (to remove)
    if (isset($input['user_id']) && (string)$input['user_id'] !== $authUserId) {
        sendResponse(['error' => 'Authenticated user mismatch'], 403);
    }

    $user_id = $authUserId;

    try {
        $table = ($type === 'post') ? 'post_votes' : 'comment_votes';
        $column = ($type === 'post') ? 'post_id' : 'comment_id';

        if ($vote === 0) {
            // Remove vote
            $stmt = $pdo->prepare("DELETE FROM $table WHERE user_id = ? AND $column = ?");
            $stmt->execute([$user_id, $target_id]);
        } else {
            // Upsert vote
            $stmt = $pdo->prepare("
                INSERT INTO $table (user_id, $column, vote) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE vote = VALUES(vote)
            ");
            $stmt->execute([$user_id, $target_id, $vote]);

            // Create notification if upvoting
            if ($vote === 1) {
                $recipient_id = null;
                $text = "";
                
                if ($type === 'post') {
                    $stmtOwner = $pdo->prepare("SELECT author_id, title FROM posts WHERE id = ?");
                    $stmtOwner->execute([$target_id]);
                    $post = $stmtOwner->fetch();
                    if ($post && $post['author_id'] !== $user_id) {
                        $recipient_id = $post['author_id'];
                        $text = "upvoted your post: " . substr($post['title'], 0, 50);
                    }
                } else {
                    $stmtOwner = $pdo->prepare("SELECT author_id, content FROM comments WHERE id = ?");
                    $stmtOwner->execute([$target_id]);
                    $comment = $stmtOwner->fetch();
                    if ($comment && $comment['author_id'] !== $user_id) {
                        $recipient_id = $comment['author_id'];
                        $text = "upvoted your comment: " . substr($comment['content'], 0, 50);
                    }
                }

                if ($recipient_id) {
                    $notif_id = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 11);
                    $stmtNotif = $pdo->prepare("
                        INSERT INTO notifications (id, recipient_id, actor_id, type, post_id, comment_id, text)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ");
                    $stmtNotif->execute([
                        $notif_id,
                        $recipient_id,
                        $user_id,
                        'upvote',
                        $type === 'post' ? $target_id : null,
                        $type === 'comment' ? $target_id : null,
                        $text
                    ]);
                }
            }
        }

        sendResponse(['success' => true]);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to process vote: ' . $e->getMessage()], 500);
    }
}
