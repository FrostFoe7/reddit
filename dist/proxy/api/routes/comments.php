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
            $stmt = $pdo->prepare("
                SELECT cd.*, COALESCE(cv.vote, 0) as user_vote
                FROM comment_details cd
                LEFT JOIN comment_votes cv ON cd.id = cv.comment_id AND cv.user_id = :user_id
                WHERE cd.post_id = :post_id 
                ORDER BY cd.created_at ASC
            ");
            $stmt->execute([':user_id' => $user_id, ':post_id' => $post_id]);
        } else {
            $stmt = $pdo->prepare("
                SELECT cd.*, COALESCE(cv.vote, 0) as user_vote
                FROM comment_details cd
                LEFT JOIN comment_votes cv ON cd.id = cv.comment_id AND cv.user_id = :user_id
                ORDER BY cd.created_at DESC LIMIT 50
            ");
            $stmt->execute([':user_id' => $user_id]);
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

        // Create notification for post owner
        $stmtPost = $pdo->prepare("SELECT author_id FROM posts WHERE id = ?");
        $stmtPost->execute([$input['post_id']]);
        $post = $stmtPost->fetch();
        
        if ($post && $post['author_id'] !== $input['author_id']) {
            $notif_id = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 11);
            $stmtNotif = $pdo->prepare("
                INSERT INTO notifications (id, recipient_id, actor_id, type, post_id, text)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmtNotif->execute([
                $notif_id,
                $post['author_id'],
                $input['author_id'],
                'comment',
                $input['post_id'],
                "commented on your post"
            ]);
        }

        // Create notification for parent comment owner if exists
        if (!empty($input['parent_id'])) {
            $stmtParent = $pdo->prepare("SELECT author_id FROM comments WHERE id = ?");
            $stmtParent->execute([$input['parent_id']]);
            $parent = $stmtParent->fetch();
            
            if ($parent && $parent['author_id'] !== $input['author_id']) {
                $notif_id = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 11);
                $stmtNotif = $pdo->prepare("
                    INSERT INTO notifications (id, recipient_id, actor_id, type, post_id, comment_id, text)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                $stmtNotif->execute([
                    $notif_id,
                    $parent['author_id'],
                    $input['author_id'],
                    'reply',
                    $input['post_id'],
                    $input['id'],
                    "replied to your comment"
                ]);
            }
        }

        sendResponse(['success' => true, 'id' => $input['id']], 201);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to create comment: ' . $e->getMessage()], 500);
    }
}
