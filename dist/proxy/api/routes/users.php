<?php
/**
 * Users Route Handler
 */

$pdo = DB::connect();
require_once __DIR__ . '/../lib/auth.php';

function usersTableHasColumn(PDO $pdo, string $column): bool
{
    static $cache = [];
    if (array_key_exists($column, $cache)) {
        return $cache[$column];
    }

    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?'
    );
    $stmt->execute(['users', $column]);
    $cache[$column] = ((int)$stmt->fetchColumn()) > 0;

    return $cache[$column];
}

function userSelectColumns(PDO $pdo): array
{
    $preferred = [
        'id',
        'username',
        'email',
        'avatar_url',
        'banner_url',
        'bio',
        'karma',
        'cake_day',
        'is_premium',
        'is_verified',
        'settings',
        'last_seen_at',
        'created_at',
    ];

    $columns = [];
    foreach ($preferred as $column) {
        if (usersTableHasColumn($pdo, $column)) {
            $columns[] = $column;
        }
    }

    if (empty($columns)) {
        $columns = ['id', 'username'];
    }

    return $columns;
}

if ($method === 'GET') {
    $username = $_GET['username'] ?? null;
    $user_id = $_GET['user_id'] ?? null;

    if (preg_match('/^users\/([^\/]+)/', $route, $matches) && $matches[1] !== 'memberships') {
        $pathParam = urldecode($matches[1]);
        if (!$username) {
            $username = $pathParam;
        }
    }

    // Fetch user memberships
    if (strpos($route, 'users/memberships') === 0 || strpos($route, 'memberships') === 0) {
        if (!$user_id) {
            $user_id = requireAuthenticatedUserId([], false);
        }
        $stmt = $pdo->prepare("SELECT subreddit_id FROM subreddit_members WHERE user_id = ?");
        $stmt->execute([$user_id]);
        sendResponse($stmt->fetchAll(PDO::FETCH_COLUMN));
    }
    
    if ($username) {
        $select = implode(', ', userSelectColumns($pdo));
        $stmt = $pdo->prepare("SELECT $select FROM users WHERE username = ? OR id = ? LIMIT 1");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendResponse(['error' => 'User not found'], 404);
        }
        
        sendResponse($user);
    } else {
        // List all users
        $stmt = $pdo->query("SELECT id, username, avatar_url, karma, is_verified FROM users ORDER BY karma DESC LIMIT 50");
        sendResponse($stmt->fetchAll());
    }
}

if ($method === 'PUT' || $method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $authUserId = requireAuthenticatedUserId($input);

    $targetId = $input['user_id'] ?? null;
    if (preg_match('/^users\/([^\/]+)/', $route, $matches) && $matches[1] !== 'memberships') {
        $targetId = $matches[1];
    }

    if (!$targetId) {
        sendResponse(['error' => 'Missing target user id'], 400);
    }

    if ((string)$targetId !== $authUserId) {
        sendResponse(['error' => 'Insufficient permissions'], 403);
    }

    $allowedFields = [
        'email' => 'email',
        'avatar_url' => 'avatar_url',
        'banner_url' => 'banner_url',
        'bio' => 'bio',
        'settings' => 'settings',
        'is_premium' => 'is_premium',
    ];

    $setClauses = [];
    $params = [':id' => $targetId];

    foreach ($allowedFields as $inputKey => $column) {
        if (array_key_exists($inputKey, $input)) {
            $paramKey = ':' . $inputKey;
            $setClauses[] = "$column = $paramKey";

            if ($inputKey === 'settings') {
                $params[$paramKey] = is_string($input[$inputKey])
                    ? $input[$inputKey]
                    : json_encode($input[$inputKey], JSON_UNESCAPED_SLASHES);
            } else {
                $params[$paramKey] = $input[$inputKey];
            }
        }
    }

    if (empty($setClauses)) {
        sendResponse(['error' => 'No valid fields to update'], 400);
    }

    try {
        $sql = "UPDATE users SET " . implode(', ', $setClauses) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $select = implode(', ', userSelectColumns($pdo));
        $stmtUser = $pdo->prepare("SELECT $select FROM users WHERE id = ? LIMIT 1");
        $stmtUser->execute([$targetId]);
        $updated = $stmtUser->fetch();

        if (!$updated) {
            sendResponse(['error' => 'User not found'], 404);
        }

        sendResponse($updated);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to update user: ' . $e->getMessage()], 500);
    }
}
