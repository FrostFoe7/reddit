<?php
/**
 * Posts Route Handler
 */

$pdo = DB::connect();

// Handle GET requests (Fetch posts)
if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    $sort = $_GET['sort'] ?? 'new'; // 'new', 'top', 'hot'
    $search = $_GET['q'] ?? null;
    $subreddit_id = $_GET['subreddit_id'] ?? null;
    
    try {
        if (preg_match('/^posts\/([^\/]+)/', $route, $matches)) {
            $post_id = $matches[1];
            $stmt = $pdo->prepare(
                "SELECT pd.*, COALESCE(pv.vote, 0) as user_vote
                 FROM post_details pd
                 LEFT JOIN post_votes pv ON pd.id = pv.post_id AND pv.user_id = :user_id
                 WHERE pd.id = :post_id
                 LIMIT 1"
            );
            $stmt->execute([
                ':user_id' => $user_id,
                ':post_id' => $post_id,
            ]);
            $post = $stmt->fetch();

            if (!$post) {
                sendResponse(['error' => 'Post not found'], 404);
            }

            sendResponse($post);
        }

        $orderBy = "pd.created_at DESC";
        if ($sort === 'top') {
            $orderBy = "pd.upvotes DESC, pd.created_at DESC";
        } elseif ($sort === 'hot') {
            // Simple hot algorithm: (upvotes) / (hours since creation + 2)
            $orderBy = "(pd.upvotes / (TIMESTAMPDIFF(HOUR, pd.created_at, NOW()) + 2)) DESC";
        }

        $query = "
            SELECT pd.*, COALESCE(pv.vote, 0) as user_vote
            FROM post_details pd
            LEFT JOIN post_votes pv ON pd.id = pv.post_id AND pv.user_id = :user_id
        ";

        $params = [':user_id' => $user_id];

        if ($search) {
            $query .= " WHERE pd.title LIKE :search OR pd.content LIKE :search ";
            $params[':search'] = '%' . $search . '%';
        }

        if ($subreddit_id) {
            if ($search) {
                $query .= " AND pd.subreddit_id = :subreddit_id ";
            } else {
                $query .= " WHERE pd.subreddit_id = :subreddit_id ";
            }
            $params[':subreddit_id'] = $subreddit_id;
        }

        $query .= " ORDER BY $orderBy LIMIT 50";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
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
    if (empty($input['id']) || empty($input['title']) || empty($input['author_id']) || empty($input['subreddit_id'])) {
        sendResponse(['error' => 'Missing required fields'], 400);
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO posts (id, author_id, subreddit_id, title, content, image_url, post_type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['id'],
            $input['author_id'],
            $input['subreddit_id'],
            $input['title'],
            $input['content'] ?? null,
            $input['image_url'] ?? null,
            $input['post_type'] ?? 'text'
        ]);

        $stmtFetch = $pdo->prepare(
            "SELECT pd.*, 0 as user_vote
             FROM post_details pd
             WHERE pd.id = ?
             LIMIT 1"
        );
        $stmtFetch->execute([$input['id']]);
        $createdPost = $stmtFetch->fetch();

        if (!$createdPost) {
            sendResponse(['success' => true, 'id' => $input['id']], 201);
        }

        sendResponse($createdPost, 201);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to create post: ' . $e->getMessage()], 500);
    }
}

if ($method === 'PUT' || $method === 'PATCH') {
    if (!preg_match('/^posts\/([^\/]+)/', $route, $matches)) {
        sendResponse(['error' => 'Invalid update route'], 400);
    }

    $postId = $matches[1];
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $userId = $input['user_id'] ?? $_GET['user_id'] ?? null;

    if (!$userId) {
        sendResponse(['error' => 'Missing user_id'], 400);
    }

    try {
        $postStmt = $pdo->prepare('SELECT id, author_id FROM posts WHERE id = ? LIMIT 1');
        $postStmt->execute([$postId]);
        $post = $postStmt->fetch();

        if (!$post) {
            sendResponse(['error' => 'Post not found'], 404);
        }

        if (($post['author_id'] ?? null) !== $userId) {
            sendResponse(['error' => 'Insufficient permissions'], 403);
        }

        $fields = [];
        $params = [];

        if (array_key_exists('title', $input)) {
            $title = trim((string)$input['title']);
            if ($title === '') {
                sendResponse(['error' => 'Title cannot be empty'], 400);
            }
            $fields[] = 'title = ?';
            $params[] = $title;
        }

        if (array_key_exists('content', $input)) {
            $fields[] = 'content = ?';
            $params[] = $input['content'];
        }

        if (array_key_exists('image_url', $input)) {
            $fields[] = 'image_url = ?';
            $params[] = $input['image_url'];
        }

        if (array_key_exists('link_url', $input)) {
            $fields[] = 'link_url = ?';
            $params[] = $input['link_url'];
        }

        if (array_key_exists('post_type', $input)) {
            $fields[] = 'post_type = ?';
            $params[] = $input['post_type'];
        }

        if (empty($fields)) {
            sendResponse(['error' => 'No valid fields to update'], 400);
        }

        $params[] = $postId;
        $stmtUpdate = $pdo->prepare('UPDATE posts SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmtUpdate->execute($params);

        $stmtFetch = $pdo->prepare('SELECT pd.*, 0 as user_vote FROM post_details pd WHERE pd.id = ? LIMIT 1');
        $stmtFetch->execute([$postId]);
        $updated = $stmtFetch->fetch();

        sendResponse($updated ?: ['success' => true, 'id' => $postId]);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to update post: ' . $e->getMessage()], 500);
    }
}

if ($method === 'DELETE') {
    if (!preg_match('/^posts\/([^\/]+)/', $route, $matches)) {
        sendResponse(['error' => 'Invalid delete route'], 400);
    }

    $postId = $matches[1];
    $userId = $_GET['user_id'] ?? null;

    if (!$userId) {
        sendResponse(['error' => 'Missing user_id'], 400);
    }

    try {
        $postStmt = $pdo->prepare('SELECT id, author_id, subreddit_id FROM posts WHERE id = ? LIMIT 1');
        $postStmt->execute([$postId]);
        $post = $postStmt->fetch();

        if (!$post) {
            sendResponse(['error' => 'Post not found'], 404);
        }

        $isAuthor = $post['author_id'] === $userId;

        $roleStmt = $pdo->prepare('SELECT role FROM subreddit_members WHERE subreddit_id = ? AND user_id = ? LIMIT 1');
        $roleStmt->execute([$post['subreddit_id'], $userId]);
        $role = $roleStmt->fetchColumn();

        $subStmt = $pdo->prepare('SELECT owner_id, creator_id FROM subreddits WHERE id = ? LIMIT 1');
        $subStmt->execute([$post['subreddit_id']]);
        $sub = $subStmt->fetch();

        $isOwnerOrCreator = $sub && (($sub['owner_id'] ?? null) === $userId || ($sub['creator_id'] ?? null) === $userId);
        $isModerator = in_array($role, ['moderator', 'admin'], true);

        if (!$isAuthor && !$isOwnerOrCreator && !$isModerator) {
            sendResponse(['error' => 'Insufficient permissions'], 403);
        }

        $deleteStmt = $pdo->prepare('DELETE FROM posts WHERE id = ?');
        $deleteStmt->execute([$postId]);

        sendResponse(['success' => true]);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to delete post: ' . $e->getMessage()], 500);
    }
}
