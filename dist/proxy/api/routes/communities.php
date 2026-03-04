<?php
/**
 * Communities Route Handler
 */

$pdo = DB::connect();

if ($method === 'GET') {
    $name = $_GET['name'] ?? null;
    $user_id = $_GET['user_id'] ?? null;
    $top = isset($_GET['top']) ? (int)$_GET['top'] : null;
    
    try {
        if ($name) {
            $stmt = $pdo->prepare("SELECT * FROM subreddits WHERE name = ?");
            $stmt->execute([$name]);
            $community = $stmt->fetch();
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

                // Check if current user is joined
                if ($user_id) {
                    $stmtJoined = $pdo->prepare("SELECT 1 FROM subreddit_members WHERE subreddit_id = ? AND user_id = ?");
                    $stmtJoined->execute([$sub_id, $user_id]);
                    $community['is_joined'] = (bool)$stmtJoined->fetch();
                } else {
                    $community['is_joined'] = false;
                }
                
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
                SELECT s.*, (SELECT COUNT(*) FROM subreddit_members WHERE subreddit_id = s.id) as members
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
    
    // Join Community
    if (strpos($route, 'communities/join') === 0) {
        if (empty($input['user_id']) || empty($input['subreddit_id'])) {
            sendResponse(['error' => 'Missing required fields'], 400);
        }

        try {
            $stmt = $pdo->prepare("INSERT IGNORE INTO subreddit_members (user_id, subreddit_id) VALUES (?, ?)");
            $stmt->execute([$input['user_id'], $input['subreddit_id']]);
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
            $stmt = $pdo->prepare("DELETE FROM subreddit_members WHERE user_id = ? AND subreddit_id = ?");
            $stmt->execute([$input['user_id'], $input['subreddit_id']]);
            sendResponse(['success' => true]);
        } catch (\Exception $e) {
            sendResponse(['error' => 'Failed to leave: ' . $e->getMessage()], 500);
        }
    }
}
