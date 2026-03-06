<?php
/**
 * Communities Route Handler
 */

$pdo = DB::connect();
require_once __DIR__ . '/../lib/auth.php';

const COMMUNITY_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
const COMMUNITY_ALLOWED_MIMES = [
    'image/jpeg',
    'image/png',
    'image/webp',
];

/**
 * Generate 11-char IDs in xxx-xxx-xxx format.
 */
function generateId(): string {
    $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    $part = function () use ($chars): string {
        $out = '';
        for ($i = 0; $i < 3; $i++) {
            $out .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $out;
    };
    return $part() . '-' . $part() . '-' . $part();
}

/**
 * Normalize route/query community keys to improve URL-safe matching.
 */
function normalizeCommunityLookupKey(string $key): string {
    $decoded = urldecode(trim($key));
    $decoded = preg_replace('/^r\//i', '', $decoded);
    return strtolower($decoded ?? '');
}

/**
 * Resolve subreddit by id, name, or url-safe slug (case-insensitive).
 */
function findSubreddit(PDO $pdo, string $idOrName): ?array {
    $normalized = normalizeCommunityLookupKey($idOrName);
    $stmt = $pdo->prepare(
        'SELECT * FROM subreddits WHERE id = ? OR LOWER(name) = ? OR LOWER(REPLACE(name, "_", "-")) = ? LIMIT 1'
    );
    $stmt->execute([$idOrName, $normalized, $normalized]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * Resolve current membership role for a user inside a subreddit.
 */
function getMembershipRole(PDO $pdo, string $subredditId, ?string $userId): ?string {
    if (!$userId) {
        return null;
    }

    $stmt = $pdo->prepare('SELECT role FROM subreddit_members WHERE subreddit_id = ? AND user_id = ? LIMIT 1');
    $stmt->execute([$subredditId, $userId]);
    $role = $stmt->fetchColumn();
    return $role ? (string)$role : null;
}

/**
 * A user can manage community if owner, creator, moderator, or admin.
 */
function canManageCommunity(array $community, ?string $role, ?string $userId): bool {
    if (!$userId) {
        return false;
    }

    $isOwner = ($community['owner_id'] ?? null) === $userId;
    $isCreator = ($community['creator_id'] ?? null) === $userId;
    $isMod = in_array($role, ['moderator', 'admin'], true);

    return $isOwner || $isCreator || $isMod;
}

/**
 * Detect multipart request payload.
 */
function isMultipartRequest(): bool {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
    return stripos($contentType, 'multipart/form-data') !== false;
}

/**
 * Read request input as array for both JSON and multipart.
 */
function getRequestInput(): array {
    if (isMultipartRequest()) {
        return $_POST;
    }

    $decoded = json_decode(file_get_contents('php://input'), true);
    return is_array($decoded) ? $decoded : [];
}

/**
 * Upload and optimize a community image to webp.
 */
function processCommunityUpload(array $file, string $kind): string {
    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Upload failed for ' . $kind . ' image', 400);
    }

    $tmpPath = $file['tmp_name'] ?? null;
    if (!is_string($tmpPath) || !is_uploaded_file($tmpPath)) {
        throw new RuntimeException('Invalid upload payload for ' . $kind . ' image', 400);
    }

    $size = isset($file['size']) ? (int)$file['size'] : 0;
    if ($size <= 0 || $size > COMMUNITY_UPLOAD_MAX_BYTES) {
        throw new RuntimeException('Invalid ' . $kind . ' image size (max 5MB)', 400);
    }

    $mime = mime_content_type($tmpPath) ?: '';
    if (!in_array($mime, COMMUNITY_ALLOWED_MIMES, true)) {
        throw new RuntimeException('Invalid ' . $kind . ' image type (jpeg/png/webp only)', 400);
    }

    $projectRoot = realpath(__DIR__ . '/../../..');
    if ($projectRoot === false) {
        throw new RuntimeException('Upload root path is unavailable', 500);
    }

    $uploadDir = $projectRoot . '/uploads/communities';
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
        throw new RuntimeException('Failed to initialize community uploads directory', 500);
    }

    $basename = date('YmdHis') . '-' . $kind . '-' . bin2hex(random_bytes(4));
    $outputName = $basename . '.webp';
    $outputPath = $uploadDir . '/' . $outputName;

    $nodeBin = trim((string)shell_exec('command -v node 2>/dev/null'));
    $script = realpath(__DIR__ . '/../../../../scripts/optimize-upload.mjs');

    if ($nodeBin !== '' && $script && file_exists($script)) {
        $cmd = escapeshellarg($nodeBin) . ' ' . escapeshellarg($script) . ' ' . escapeshellarg($tmpPath) . ' ' . escapeshellarg($outputPath);
        $log = [];
        $status = 0;
        exec($cmd, $log, $status);
        if ($status !== 0 || !file_exists($outputPath)) {
            throw new RuntimeException('Failed to optimize ' . $kind . ' image', 500);
        }

        return '/uploads/communities/' . $outputName;
    }

    if (!function_exists('imagewebp')) {
        throw new RuntimeException('Image optimization is unavailable on this server', 500);
    }

    switch ($mime) {
        case 'image/jpeg':
            $source = imagecreatefromjpeg($tmpPath);
            break;
        case 'image/png':
            $source = imagecreatefrompng($tmpPath);
            break;
        case 'image/webp':
            $source = imagecreatefromwebp($tmpPath);
            break;
        default:
            $source = false;
            break;
    }

    if (!$source) {
        throw new RuntimeException('Could not read uploaded ' . $kind . ' image', 400);
    }

    $width = imagesx($source);
    $height = imagesy($source);
    $maxWidth = 1440;
    if ($width > $maxWidth) {
        $newWidth = $maxWidth;
        $newHeight = (int)round(($height / $width) * $newWidth);
        $resized = imagecreatetruecolor($newWidth, $newHeight);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagecopyresampled($resized, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        imagedestroy($source);
        $source = $resized;
    }

    $writeOk = imagewebp($source, $outputPath, 80);
    imagedestroy($source);

    if (!$writeOk || !file_exists($outputPath)) {
        throw new RuntimeException('Failed to store optimized ' . $kind . ' image', 500);
    }

    return '/uploads/communities/' . $outputName;
}

/**
 * Populate derived fields for community response.
 */
function hydrateCommunityDetails(PDO $pdo, array $community, ?string $userId): array {
    $subId = (string)$community['id'];

    $stmtCount = $pdo->prepare('SELECT COUNT(*) FROM subreddit_members WHERE subreddit_id = ?');
    $stmtCount->execute([$subId]);
    $community['members'] = (int)$stmtCount->fetchColumn();

    $stmtRules = $pdo->prepare('SELECT title, description AS content FROM subreddit_rules WHERE subreddit_id = ? ORDER BY priority ASC');
    $stmtRules->execute([$subId]);
    $community['rules'] = $stmtRules->fetchAll();

    $stmtMods = $pdo->prepare(
        "SELECT u.id, u.username, u.avatar_url
         FROM users u
         JOIN subreddit_members sm ON u.id = sm.user_id
         WHERE sm.subreddit_id = ? AND sm.role IN ('moderator', 'admin')"
    );
    $stmtMods->execute([$subId]);
    $community['moderators'] = $stmtMods->fetchAll();

    $stmtMembers = $pdo->prepare(
        'SELECT u.id, u.username, u.avatar_url, sm.role FROM users u JOIN subreddit_members sm ON u.id = sm.user_id WHERE sm.subreddit_id = ? ORDER BY sm.joined_at ASC LIMIT 50'
    );
    $stmtMembers->execute([$subId]);
    $community['members_list'] = $stmtMembers->fetchAll();

    $stmtPosts = $pdo->prepare('SELECT COUNT(*) FROM posts WHERE subreddit_id = ?');
    $stmtPosts->execute([$subId]);
    $community['post_count'] = (int)$stmtPosts->fetchColumn();

    $role = getMembershipRole($pdo, $subId, $userId);
    $community['is_joined'] = $role !== null;
    $community['current_user_role'] = $role;
    $community['can_manage'] = canManageCommunity($community, $role, $userId);

    return $community;
}

if ($method === 'GET') {
    $name = $_GET['name'] ?? null;
    if (!$name && preg_match('/^communities\/([^\/]+)/', $route, $matches)) {
        $candidate = $matches[1];
        if (!in_array($candidate, ['join', 'leave', 'create'], true)) {
            $name = $candidate;
        }
    }

    $user_id = $_GET['user_id'] ?? resolveTokenUserId(getBearerToken());
    $top = isset($_GET['top']) ? (int)$_GET['top'] : null;

    try {
        if ($name) {
            $community = findSubreddit($pdo, (string)$name);
            if (!$community) {
                sendResponse(['error' => 'Community not found'], 404);
            }

            $hydrated = hydrateCommunityDetails($pdo, $community, $user_id ?: null);
            sendResponse($hydrated);
        }

        if ($top) {
            $stmt = $pdo->prepare(
                'SELECT s.*, (SELECT COUNT(*) FROM subreddit_members WHERE subreddit_id = s.id) as members FROM subreddits s ORDER BY members DESC LIMIT ?'
            );
            $stmt->execute([$top]);
            sendResponse($stmt->fetchAll());
        }

        $stmt = $pdo->query(
            'SELECT s.*, (SELECT COUNT(*) FROM subreddit_members WHERE subreddit_id = s.id) as members, (SELECT COUNT(*) FROM posts WHERE subreddit_id = s.id) as post_count FROM subreddits s ORDER BY name ASC'
        );
        sendResponse($stmt->fetchAll());
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to fetch communities: ' . $e->getMessage()], 500);
    }
}

if ($method === 'POST') {
    $input = getRequestInput();

    // Remove member (moderator action)
    if (strpos($route, 'communities/mod/remove-member') === 0) {
        $authUserId = requireAuthenticatedUserId($input);
        $subredditId = (string)($input['subreddit_id'] ?? '');
        $targetUserId = (string)($input['target_user_id'] ?? '');

        if ($subredditId === '' || $targetUserId === '') {
            sendResponse(['error' => 'Missing required fields: subreddit_id and target_user_id'], 400);
        }

        try {
            $community = findSubreddit($pdo, $subredditId);
            if (!$community) {
                sendResponse(['error' => 'Community not found'], 404);
            }

            $actorRole = getMembershipRole($pdo, (string)$community['id'], $authUserId);
            if (!canManageCommunity($community, $actorRole, $authUserId)) {
                sendResponse(['error' => 'Permission denied'], 403);
            }

            if ($targetUserId === ($community['creator_id'] ?? null) || $targetUserId === ($community['owner_id'] ?? null)) {
                sendResponse(['error' => 'Cannot remove community creator/owner'], 403);
            }

            $stmt = $pdo->prepare('DELETE FROM subreddit_members WHERE subreddit_id = ? AND user_id = ?');
            $stmt->execute([$community['id'], $targetUserId]);
            sendResponse(['success' => true]);
        } catch (\Exception $e) {
            sendResponse(['error' => 'Failed to remove member: ' . $e->getMessage()], 500);
        }
    }

    // Ban member (moderator action)
    if (strpos($route, 'communities/mod/ban-member') === 0) {
        $authUserId = requireAuthenticatedUserId($input);
        $subredditId = (string)($input['subreddit_id'] ?? '');
        $targetUserId = (string)($input['target_user_id'] ?? '');
        $reason = trim((string)($input['reason'] ?? ''));

        if ($subredditId === '' || $targetUserId === '') {
            sendResponse(['error' => 'Missing required fields: subreddit_id and target_user_id'], 400);
        }

        try {
            $community = findSubreddit($pdo, $subredditId);
            if (!$community) {
                sendResponse(['error' => 'Community not found'], 404);
            }

            $actorRole = getMembershipRole($pdo, (string)$community['id'], $authUserId);
            if (!canManageCommunity($community, $actorRole, $authUserId)) {
                sendResponse(['error' => 'Permission denied'], 403);
            }

            if ($targetUserId === ($community['creator_id'] ?? null) || $targetUserId === ($community['owner_id'] ?? null)) {
                sendResponse(['error' => 'Cannot ban community creator/owner'], 403);
            }

            $stmtBan = $pdo->prepare('INSERT INTO subreddit_bans (user_id, subreddit_id, banned_by, reason) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE banned_by = VALUES(banned_by), reason = VALUES(reason), banned_at = CURRENT_TIMESTAMP');
            $stmtBan->execute([$targetUserId, $community['id'], $authUserId, $reason !== '' ? $reason : null]);

            $stmtRemove = $pdo->prepare('DELETE FROM subreddit_members WHERE subreddit_id = ? AND user_id = ?');
            $stmtRemove->execute([$community['id'], $targetUserId]);

            sendResponse(['success' => true]);
        } catch (\Exception $e) {
            sendResponse(['error' => 'Failed to ban member: ' . $e->getMessage()], 500);
        }
    }

    // Create Community
    if (strpos($route, 'communities/create') === 0 || $route === 'communities') {
        $authUserId = requireAuthenticatedUserId($input);
        $name = trim((string)($input['name'] ?? ''));
        $description = trim((string)($input['description'] ?? ''));
        $icon = $input['icon_url'] ?? null;
        $banner = $input['banner_url'] ?? null;

        if (isset($_FILES['icon']) && is_array($_FILES['icon']) && (int)($_FILES['icon']['size'] ?? 0) > 0) {
            try {
                $icon = processCommunityUpload($_FILES['icon'], 'icon');
            } catch (RuntimeException $e) {
                $status = $e->getCode() >= 400 ? $e->getCode() : 400;
                sendResponse(['error' => $e->getMessage()], $status);
            }
        }

        if (isset($_FILES['banner']) && is_array($_FILES['banner']) && (int)($_FILES['banner']['size'] ?? 0) > 0) {
            try {
                $banner = processCommunityUpload($_FILES['banner'], 'banner');
            } catch (RuntimeException $e) {
                $status = $e->getCode() >= 400 ? $e->getCode() : 400;
                sendResponse(['error' => $e->getMessage()], $status);
            }
        }

        if ($name === '') {
            sendResponse(['error' => 'Missing required field: name'], 400);
        }

        if (!preg_match('/^[A-Za-z0-9_]{3,32}$/', $name)) {
            sendResponse(['error' => 'Community name must be 3-32 chars: letters, numbers, underscore'], 400);
        }

        try {
            $existsStmt = $pdo->prepare('SELECT 1 FROM subreddits WHERE LOWER(name) = LOWER(?) LIMIT 1');
            $existsStmt->execute([$name]);
            if ($existsStmt->fetch()) {
                sendResponse(['error' => 'Community name already exists'], 409);
            }

            $subredditId = generateId();

            $pdo->beginTransaction();

            $stmt = $pdo->prepare(
                'INSERT INTO subreddits (id, name, description, icon_url, banner_url, creator_id, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $subredditId,
                $name,
                $description !== '' ? $description : null,
                $icon,
                $banner,
                $authUserId,
                $authUserId,
            ]);

            $memberStmt = $pdo->prepare('INSERT INTO subreddit_members (user_id, subreddit_id, role) VALUES (?, ?, "admin")');
            $memberStmt->execute([$authUserId, $subredditId]);

            $pdo->commit();

            $fetchStmt = $pdo->prepare('SELECT * FROM subreddits WHERE id = ? LIMIT 1');
            $fetchStmt->execute([$subredditId]);
            $created = $fetchStmt->fetch();
            if (!$created) {
                sendResponse(['error' => 'Community created but could not be loaded'], 500);
            }

            $created = hydrateCommunityDetails($pdo, $created, $authUserId);
            sendResponse($created, 201);
        } catch (\Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            sendResponse(['error' => 'Failed to create community: ' . $e->getMessage()], 500);
        }
    }

    // Join Community
    if (strpos($route, 'communities/join') === 0) {
        $authUserId = requireAuthenticatedUserId($input);
        if (empty($input['subreddit_id'])) {
            sendResponse(['error' => 'Missing required field: subreddit_id'], 400);
        }

        try {
            $sub = findSubreddit($pdo, (string)$input['subreddit_id']);
            if (!$sub) {
                sendResponse(['error' => 'Community not found'], 404);
            }

            $banStmt = $pdo->prepare('SELECT 1 FROM subreddit_bans WHERE subreddit_id = ? AND user_id = ? LIMIT 1');
            $banStmt->execute([$sub['id'], $authUserId]);
            if ($banStmt->fetch()) {
                sendResponse(['error' => 'You are banned from this community'], 403);
            }

            $stmt = $pdo->prepare('INSERT IGNORE INTO subreddit_members (user_id, subreddit_id) VALUES (?, ?)');
            $stmt->execute([$authUserId, $sub['id']]);
            sendResponse(['success' => true]);
        } catch (\Exception $e) {
            sendResponse(['error' => 'Failed to join community: ' . $e->getMessage()], 500);
        }
    }

    // Leave Community
    if (strpos($route, 'communities/leave') === 0) {
        $authUserId = requireAuthenticatedUserId($input);
        if (empty($input['subreddit_id'])) {
            sendResponse(['error' => 'Missing required field: subreddit_id'], 400);
        }

        try {
            $sub = findSubreddit($pdo, (string)$input['subreddit_id']);
            if (!$sub) {
                sendResponse(['error' => 'Community not found'], 404);
            }

            if (($sub['owner_id'] ?? null) === $authUserId || ($sub['creator_id'] ?? null) === $authUserId) {
                sendResponse(['error' => 'Creator cannot leave without transferring ownership'], 403);
            }

            $role = getMembershipRole($pdo, $sub['id'], (string)$authUserId);
            if ($role === null) {
                sendResponse(['error' => 'You are not a member of this community'], 400);
            }

            $stmt = $pdo->prepare('DELETE FROM subreddit_members WHERE user_id = ? AND subreddit_id = ?');
            $stmt->execute([$authUserId, $sub['id']]);
            sendResponse(['success' => true]);
        } catch (\Exception $e) {
            sendResponse(['error' => 'Failed to leave community: ' . $e->getMessage()], 500);
        }
    }
}

if ($method === 'DELETE') {
    if (!preg_match('/^communities\/([^\/]+)/', $route, $matches)) {
        sendResponse(['error' => 'Invalid delete route'], 400);
    }

    $communityId = $matches[1];
    $userId = requireAuthenticatedUserId();

    try {
        $community = findSubreddit($pdo, $communityId);
        if (!$community) {
            sendResponse(['error' => 'Community not found'], 404);
        }

        $role = getMembershipRole($pdo, $community['id'], $userId);
        if (!canManageCommunity($community, $role, $userId)) {
            sendResponse(['error' => 'Permission denied: only creator/moderator can delete'], 403);
        }

        $pdo->beginTransaction();

        $stmtMembers = $pdo->prepare('DELETE FROM subreddit_members WHERE subreddit_id = ?');
        $stmtMembers->execute([$community['id']]);

        $stmtRules = $pdo->prepare('DELETE FROM subreddit_rules WHERE subreddit_id = ?');
        $stmtRules->execute([$community['id']]);

        $stmtBans = $pdo->prepare('DELETE FROM subreddit_bans WHERE subreddit_id = ?');
        $stmtBans->execute([$community['id']]);

        $stmtSub = $pdo->prepare('DELETE FROM subreddits WHERE id = ?');
        $stmtSub->execute([$community['id']]);

        $pdo->commit();
        sendResponse(['success' => true]);
    } catch (\Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        sendResponse(['error' => 'Failed to delete community: ' . $e->getMessage()], 500);
    }
}

if ($method === 'PUT' || $method === 'PATCH') {
    if (!preg_match('/^communities\/([^\/]+)/', $route, $matches)) {
        sendResponse(['error' => 'Invalid update route'], 400);
    }

    $communityId = $matches[1];
    $input = getRequestInput();
    $userId = requireAuthenticatedUserId($input);

    try {
        $community = findSubreddit($pdo, $communityId);
        if (!$community) {
            sendResponse(['error' => 'Community not found'], 404);
        }

        $role = getMembershipRole($pdo, $community['id'], $userId);
        if (!canManageCommunity($community, $role, $userId)) {
            sendResponse(['error' => 'Permission denied: only creator/moderator can edit'], 403);
        }

        $fields = [];
        $params = [];

        if (array_key_exists('description', $input)) {
            $fields[] = 'description = ?';
            $params[] = trim((string)$input['description']) ?: null;
        }

        if (array_key_exists('icon_url', $input)) {
            $fields[] = 'icon_url = ?';
            $params[] = $input['icon_url'];
        }

        if (array_key_exists('banner_url', $input)) {
            $fields[] = 'banner_url = ?';
            $params[] = $input['banner_url'];
        }

        if (isset($_FILES['icon']) && is_array($_FILES['icon']) && (int)($_FILES['icon']['size'] ?? 0) > 0) {
            $fields[] = 'icon_url = ?';
            $params[] = processCommunityUpload($_FILES['icon'], 'icon');
        }

        if (isset($_FILES['banner']) && is_array($_FILES['banner']) && (int)($_FILES['banner']['size'] ?? 0) > 0) {
            $fields[] = 'banner_url = ?';
            $params[] = processCommunityUpload($_FILES['banner'], 'banner');
        }

        if (empty($fields)) {
            sendResponse(['error' => 'No valid fields to update'], 400);
        }

        $params[] = $community['id'];
        $stmt = $pdo->prepare('UPDATE subreddits SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($params);

        $updated = findSubreddit($pdo, $community['id']);
        if (!$updated) {
            sendResponse(['error' => 'Community not found after update'], 404);
        }

        $updated = hydrateCommunityDetails($pdo, $updated, $userId);
        sendResponse($updated);
    } catch (RuntimeException $e) {
        $status = $e->getCode() >= 400 ? $e->getCode() : 400;
        sendResponse(['error' => $e->getMessage()], $status);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to update community: ' . $e->getMessage()], 500);
    }
}
