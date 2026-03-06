<?php
/**
 * Messages Route Handler
 */

$pdo = DB::connect();
require_once __DIR__ . '/../lib/auth.php';

if ($method === 'GET') {
    $authUserId = requireAuthenticatedUserId();
    $user_id = $_GET['user_id'] ?? $authUserId;
    $conversation_id = $_GET['conversation_id'] ?? null;

    if ((string)$user_id !== $authUserId) {
        sendResponse(['error' => 'Insufficient permissions'], 403);
    }

    try {
        if ($conversation_id) {
            // Fetch messages for a specific conversation
            $stmt = $pdo->prepare("
                SELECT m.*, u.username as sender_name, u.avatar_url as sender_avatar
                FROM messages m
                JOIN users u ON m.sender_id = u.id
                WHERE m.conversation_id = ?
                ORDER BY m.created_at ASC
            ");
            $stmt->execute([$conversation_id]);
            sendResponse($stmt->fetchAll());
        } else {
            // Fetch all conversations for the user
            $stmt = $pdo->prepare("
                SELECT c.*, 
                       (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_msg,
                       (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as time,
                       u.username as contact_name, u.avatar_url as contact_avatar, u.id as contact_id
                FROM conversations c
                JOIN conversation_participants cp ON c.id = cp.conversation_id
                JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id != cp.user_id
                JOIN users u ON cp2.user_id = u.id
                WHERE cp.user_id = ?
                ORDER BY c.last_message_at DESC
            ");
            $stmt->execute([$user_id]);
            sendResponse($stmt->fetchAll());
        }
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to fetch messages: ' . $e->getMessage()], 500);
    }
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $authUserId = requireAuthenticatedUserId($input);

    if (isset($input['sender_id']) && (string)$input['sender_id'] !== $authUserId) {
        sendResponse(['error' => 'Authenticated user mismatch'], 403);
    }
    $input['sender_id'] = $authUserId;
    
    if (empty($input['sender_id']) || empty($input['conversation_id']) || empty($input['content'])) {
        sendResponse(['error' => 'Missing required fields'], 400);
    }

    try {
        $id = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 3) . '-' . 
              substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 3) . '-' . 
              substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 3);

        $stmt = $pdo->prepare("
            INSERT INTO messages (id, conversation_id, sender_id, content)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([
            $id,
            $input['conversation_id'],
            $input['sender_id'],
            $input['content']
        ]);

        // Update conversation last_message_at
        $stmtUpdate = $pdo->prepare("UPDATE conversations SET last_message_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmtUpdate->execute([$input['conversation_id']]);

        sendResponse(['success' => true, 'id' => $id]);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to send message: ' . $e->getMessage()], 500);
    }
}
