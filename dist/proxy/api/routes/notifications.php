<?php
/**
 * Notifications Route Handler
 */

$pdo = DB::connect();

if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    
    if (!$user_id) {
        sendResponse(['error' => 'Missing user_id'], 400);
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM notifications WHERE recipient_id = ? ORDER BY created_at DESC LIMIT 20");
        $stmt->execute([$user_id]);
        $notifications = $stmt->fetchAll();
        
        sendResponse($notifications);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to fetch notifications: ' . $e->getMessage()], 500);
    }
}

if ($method === 'POST' && strpos($route, 'notifications/mark-read') === 0) {
    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = $input['user_id'] ?? null;
    $notification_id = $input['notification_id'] ?? null;

    if (!$user_id) {
        sendResponse(['error' => 'Missing user_id'], 400);
    }

    try {
        if ($notification_id) {
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE recipient_id = ? AND id = ?");
            $stmt->execute([$user_id, $notification_id]);
        } else {
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE recipient_id = ?");
            $stmt->execute([$user_id]);
        }
        
        sendResponse(['success' => true]);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to mark notifications as read: ' . $e->getMessage()], 500);
    }
}
