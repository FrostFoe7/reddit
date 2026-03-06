<?php
/**
 * Communities Route Handler
 */

$pdo = DB::connect();

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
 * Resolve subreddit by id or name.
 */
function findSubreddit(PDO $pdo, string $idOrName): ?array {
    $stmt = $pdo->prepare('SELECT * FROM subreddits WHERE id = ? OR name = ? LIMIT 1');
    $stmt->execute([$idOrName, $idOrName]);
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

if ($method === 'GET') {
    $name = $_GET['name'] ?? null;
    $user_id = $_GET['user_id'] ?? null;
    $top = isset($_GET['top']) ? (int)$_GET['top'] : null;
    
    try {
        if ($name) {
            $community = findSubreddit($pdo, $name);
            if ($community) {
                $sub_id = $community['id'];
                
                // Get member count
                $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM subreddit_members WHERE subreddit_id = ?");
                $stmtCount->execute([$sub_id]);
                $community['members'] = $stmtCount->fetchColumn();
                
                // Get rules
                $stmtRules = $pdo->prepare("SELECT * FROM subreddit_rules WHERE subreddit_id = ? ORDER BY priority ASC");
                $stmtRules->execute([$sub_id]);
                $community['rules'] = $stmtRules->fetchAll();

                // Get moderators
                $stmtMods = $pdo->prepare("
                    SELECT u.id, u.username, u.avatar_url 
                    FROM users u
                    JOIN subreddit_members sm ON u.id = sm.user_id
                    WHERE sm.subreddit_id = ? AND sm.role IN ('moderator', 'admin')
                ");
                $stmtMods->execute([$sub_id]);
                $community['moderators'] = $stmtMods->fetchAll();

                // Post count
                $stmtPosts = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE subreddit_id = ?");
                $stmtPosts->execute([$sub_id]);
                $community['post_count'] = (int)$stmtPosts->fetchColumn();

                // Check if current user is joined
                $role = getMembershipRole($pdo, $sub_id, $user_id);
                $community['is_joined'] = $role !== null;
                $community['current_user_role'] = $role;
                $community['can_manage'] = canManageCommunity($community, $role, $user_id);
                
                sendResponse($community);
            } else {
                sendResponse(['error' => 'Community not found'], 404);
            }
        } elseif ($top) {
            // Fetch top communities by member count
            $stmt = $pdo->prepare("
                SELECT s.*, (SELECT COUNT(*) FROM subreddit_members WHERE subreddit_id = s.id) as members
                FROM subreddits s
                ORDER BY members DESC
                LIMIT ?
            ");
            $stmt->execute([$top]);
            sendResponse($stmt->fetchAll());
        } else {
            $stmt = $pdo->query("
                SELECT s.*, 
                       (SELECT COUNT(*) FROM subreddit_members WHERE subreddit_id = s.id) as members,
                       (SELECT COUNT(*) FROM posts WHERE subreddit_id = s.id) as post_count
                FROM subreddits s
                ORDER BY name ASC
            ");
            $communities = $stmt->fetchAll();
            sendResponse($communities);
        }
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to fetch communities: ' . $e->getMessage()], 500);
    }
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        $input = [];
    }

    // Create Community
    if (strpos($route, 'communities/create') === 0 || $route === 'communities') {
        $name = trim((string)($input['name'] ?? ''));
        $description = trim((string)($input['description'] ?? ''));
        $icon = $input['icon_url'] ?? null;
        $banner = $input['banner_url'] ?? null;
        $userId = $input['user_id'] ?? null;

        if (!$userId || $name === '') {
            sendResponse(['error' => 'Missing required fields'], 400);
        }

        if (!preg_match('/^[A-Za-z0-9_]{3,21}$/', $name)) {
            sendResponse(['error' => 'Community name must be 3-21 chars: letters, numbers, underscore'], 400);
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
                $userId,
                $userId,
            ]);

            $memberStmt = $pdo->prepare('INSERT INTO subreddit_members (user_id, subreddit_id, role) VALUES (?, ?, "admin")');
            $memberStmt->execute([$userId, $subredditId]);

            $pdo->commit();

            $fetchStmt = $pdo->prepare('SELECT * FROM subreddits WHERE id = ? LIMIT 1');
            $fetchStmt->execute([$subredditId]);
            $created = $fetchStmt->fetch();
            if (!$created) {
                sendResponse(['error' => 'Community created but could not be loaded'], 500);
            }

            $created['members'] = 1;
            $created['post_count'] = 0;
            $created['is_joined'] = true;
            $created['current_user_role'] = 'admin';
            $created['can_manage'] = true;

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
        if (empty($input['user_id']) || empty($input['subreddit_id'])) {
            sendResponse(['error' => 'Missing required fields'], 400);
        }

        try {
            $sub = findSubreddit($pdo, (string)$input['subreddit_id']);
            if (!$sub) {
                sendResponse(['error' => 'Community not found'], 404);
            }

            $banStmt = $pdo->prepare('SELECT 1 FROM subreddit_bans WHERE subreddit_id = ? AND user_id = ? LIMIT 1');
            $banStmt->execute([$sub['id'], $input['user_id']]);
            if ($banStmt->fetch()) {
                sendResponse(['error' => 'You are banned from this community'], 403);
            }

            $stmt = $pdo->prepare("INSERT IGNORE INTO subreddit_members (user_id, subreddit_id) VALUES (?, ?)");
            $stmt->execute([$input['user_id'], $sub['id']]);
            sendResponse(['success' => true]);
        } catch (\Exception $e) {
            sendResponse(['error' => 'Failed to join: ' . $e->getMessage()], 500);
        }
    }

    // Leave Community
    if (strpos($route, 'communities/leave') === 0) {
        if (empty($input['user_id']) || empty($input['subreddit_id'])) {
            sendResponse(['error' => 'Missing required fields'], 400);
        }

        try {
            $sub = findSubreddit($pdo, (string)$input['subreddit_id']);
            if (!$sub) {
                sendResponse(['error' => 'Community not found'], 404);
            }

            if (($sub['owner_id'] ?? null) === $input['user_id'] || ($sub['creator_id'] ?? null) === $input['user_id']) {
                sendResponse(['error' => 'Owner cannot leave without transferring ownership'], 403);
            }

            $role = getMembershipRole($pdo, $sub['id'], (string)$input['user_id']);
            if ($role === null) {
                sendResponse(['error' => 'Not a member of this community'], 400);
            }

            $stmt = $pdo->prepare("DELETE FROM subreddit_members WHERE user_id = ? AND subreddit_id = ?");
            $stmt->execute([$input['user_id'], $sub['id']]);
            sendResponse(['success' => true]);
        } catch (\Exception $e) {
            sendResponse(['error' => 'Failed to leave: ' . $e->getMessage()], 500);
        }
    }
}

if ($method === 'DELETE') {
    if (!preg_match('/^communities\/([^\/]+)/', $route, $matches)) {
        sendResponse(['error' => 'Invalid delete route'], 400);
    }

    $communityId = $matches[1];
    $userId = $_GET['user_id'] ?? null;

    if (!$userId) {
        sendResponse(['error' => 'Missing user_id'], 400);
    }

    try {
        $community = findSubreddit($pdo, $communityId);
        if (!$community) {
            sendResponse(['error' => 'Community not found'], 404);
        }

        $role = getMembershipRole($pdo, $community['id'], $userId);
        if (!canManageCommunity($community, $role, $userId)) {
            sendResponse(['error' => 'Insufficient permissions'], 403);
        }

        $pdo->beginTransaction();

        // Explicit cleanup before deleting subreddit row.
        $stmtMembers = $pdo->prepare('DELETE FROM subreddit_members WHERE subreddit_id = ?');
        $stmtMembers->execute([$community['id']]);

        $stmtRules = $pdo->prepare('DELETE FROM subreddit_rules WHERE subreddit_id = ?');
        $stmtRules->execute([$community['id']]);

        $stmtBans = $pdo->prepare('DELETE FROM subreddit_bans WHERE subreddit_id = ?');
        $stmtBans->execute([$community['id']]);

        // Posts/comments/votes/notifications are cleaned via FK cascades from posts/comments.
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
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $userId = $input['user_id'] ?? $_GET['user_id'] ?? null;

    if (!$userId) {
        sendResponse(['error' => 'Missing user_id'], 400);
    }

    try {
        $community = findSubreddit($pdo, $communityId);
        if (!$community) {
            sendResponse(['error' => 'Community not found'], 404);
        }

        $role = getMembershipRole($pdo, $community['id'], $userId);
        if (!canManageCommunity($community, $role, $userId)) {
            sendResponse(['error' => 'Insufficient permissions'], 403);
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

        $stmtCount = $pdo->prepare('SELECT COUNT(*) FROM subreddit_members WHERE subreddit_id = ?');
        $stmtCount->execute([$updated['id']]);
        $updated['members'] = (int)$stmtCount->fetchColumn();

        $updatedRole = getMembershipRole($pdo, $updated['id'], $userId);
        $updated['is_joined'] = $updatedRole !== null;
        $updated['current_user_role'] = $updatedRole;
        $updated['can_manage'] = canManageCommunity($updated, $updatedRole, $userId);

        sendResponse($updated);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to update community: ' . $e->getMessage()], 500);
    }
}
