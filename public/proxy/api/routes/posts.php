<?php
/**
 * Posts Route Handler
 */

$pdo = DB::connect();
require_once __DIR__ . '/../lib/auth.php';

function tableHasColumn(PDO $pdo, string $table, string $column): bool
{
    static $cache = [];
    $key = $table . '.' . $column;
    if (array_key_exists($key, $cache)) {
        return $cache[$key];
    }

    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?'
    );
    $stmt->execute([$table, $column]);
    $cache[$key] = ((int)$stmt->fetchColumn()) > 0;

    return $cache[$key];
}

function buildPostSelectBase(): string
{
    return "
        SELECT
            p.*,
            u.username AS author_username,
            u.avatar_url AS author_avatar,
            u.is_verified AS author_is_verified,
            s.name AS subreddit_name,
            s.icon_url AS subreddit_icon,
            s.is_verified AS subreddit_is_verified,
            COALESCE(v.upvotes, 0) AS upvotes,
            COALESCE(c.comment_count, 0) AS comment_count,
            COALESCE(pv.vote, 0) AS user_vote
        FROM posts p
        JOIN users u ON p.author_id = u.id
        JOIN subreddits s ON p.subreddit_id = s.id
        LEFT JOIN (
            SELECT post_id, SUM(vote) AS upvotes
            FROM post_votes
            GROUP BY post_id
        ) v ON p.id = v.post_id
        LEFT JOIN (
            SELECT post_id, COUNT(*) AS comment_count
            FROM comments
            GROUP BY post_id
        ) c ON p.id = c.post_id
        LEFT JOIN post_votes pv ON p.id = pv.post_id AND pv.user_id = :user_id
    ";
}

function fetchPostById(PDO $pdo, string $postId, ?string $userId): ?array
{
    $sql = buildPostSelectBase() . ' WHERE p.id = :post_id LIMIT 1';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':user_id' => $userId,
        ':post_id' => $postId,
    ]);

    $row = $stmt->fetch();
    return $row ?: null;
}

// Handle GET requests (Fetch posts)
if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    $sort = $_GET['sort'] ?? 'new'; // 'new', 'top', 'hot'
    $search = $_GET['q'] ?? null;
    $subreddit_id = $_GET['subreddit_id'] ?? null;
    
    try {
        if (preg_match('/^posts\/([^\/]+)/', $route, $matches)) {
            $post_id = $matches[1];
            $post = fetchPostById($pdo, $post_id, $user_id);

            if (!$post) {
                sendResponse(['error' => 'Post not found'], 404);
            }

            sendResponse($post);
        }

        $orderBy = 'p.created_at DESC';
        if ($sort === 'top') {
            $orderBy = 'upvotes DESC, p.created_at DESC';
        } elseif ($sort === 'hot') {
            // Simple hot algorithm: (upvotes) / (hours since creation + 2)
            $orderBy = '(upvotes / (TIMESTAMPDIFF(HOUR, p.created_at, NOW()) + 2)) DESC';
        }

        $query = buildPostSelectBase();

        $params = [':user_id' => $user_id];

        if ($search) {
            $query .= ' WHERE p.title LIKE :search OR p.content LIKE :search ';
            $params[':search'] = '%' . $search . '%';
        }

        if ($subreddit_id) {
            if ($search) {
                $query .= ' AND p.subreddit_id = :subreddit_id ';
            } else {
                $query .= ' WHERE p.subreddit_id = :subreddit_id ';
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
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $authUserId = requireAuthenticatedUserId($input);

    if (isset($input['author_id']) && (string)$input['author_id'] !== $authUserId) {
        sendResponse(['error' => 'Authenticated user mismatch'], 403);
    }
    $input['author_id'] = $authUserId;
    
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

        $createdPost = fetchPostById($pdo, (string)$input['id'], null);

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
    $userId = requireAuthenticatedUserId($input);

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

        $updated = fetchPostById($pdo, $postId, $userId);

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
    $userId = requireAuthenticatedUserId();

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

        $hasCreatorId = tableHasColumn($pdo, 'subreddits', 'creator_id');
        $subSelect = $hasCreatorId ? 'SELECT owner_id, creator_id' : 'SELECT owner_id, NULL AS creator_id';
        $subStmt = $pdo->prepare($subSelect . ' FROM subreddits WHERE id = ? LIMIT 1');
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
