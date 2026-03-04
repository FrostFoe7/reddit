<?php
/**
 * Notifications Route Handler
 */

$pdo = DB::connect();

if ($method === 'GET') {
    try {
        // Fetch notifications for a mock recipient (User123)
        // In a real app, this would use the logged-in user's ID
        $recipient_id = '1bw-j2k-e39'; 
        
        $stmt = $pdo->prepare("SELECT * FROM notifications WHERE recipient_id = ? ORDER BY created_at DESC");
        $stmt->execute([$recipient_id]);
        $notifications = $stmt->fetchAll();
        
        sendResponse($notifications);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to fetch notifications: ' . $e->getMessage()], 500);
    }
}

if ($method === 'POST' && $route === 'notifications/mark-read') {
    try {
        $recipient_id = '1bw-j2k-e39';
        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE recipient_id = ?");
        $stmt->execute([$recipient_id]);
        
        sendResponse(['success' => true]);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to mark notifications as read: ' . $e->getMessage()], 500);
    }
}
