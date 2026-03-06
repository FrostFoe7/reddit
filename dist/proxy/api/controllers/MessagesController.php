<?php
/**
 * Messages Controller
 * Handles messaging and conversations
 */

require_once __DIR__ . '/../controllers/BaseController.php';
require_once __DIR__ . '/../models/MessagesModel.php';

class MessagesController extends BaseController
{
    private MessagesModel $messagesModel;

    public function __construct(\PDO $pdo, string $method, string $route)
    {
        parent::__construct($pdo, $method, $route);
        $this->messagesModel = new MessagesModel($pdo);
    }

    public function handle(): void
    {
        try {
            if ($this->method === 'GET') {
                $this->handleGet();
            } elseif ($this->method === 'POST') {
                $this->handlePost();
            } else {
                $this->sendError('Method not allowed', 405);
            }
        } catch (\Exception $e) {
            $this->handleError($e);
        }
    }

    private function handleGet(): void
    {
        $userId = $this->getParam('user_id');

        if (!$userId) {
            $this->sendError('User ID required', 400);
        }

        // Check if requesting specific conversation messages (e.g., /messages/conversation_id)
        if (preg_match('/^messages\/([^\/]+)/', $this->route, $matches)) {
            $conversationId = $matches[1];
            $messages = $this->messagesModel->fetchMessages($conversationId);
            $this->sendSuccess($messages);
            return;
        }

        // Fetch all conversations for user
        $conversations = $this->messagesModel->fetchConversations($userId);
        $this->sendSuccess($conversations);
    }

    private function handlePost(): void
    {
        $input = $this->getJsonBody();
        $userId = $this->getParam('user_id');

        if (!$userId) {
            $this->sendError('User ID required', 400);
        }

        // Handle create conversation
        if (strpos($this->route, 'conversations') !== false && !isset($input['conversation_id'])) {
            $this->validateRequired($input, ['other_user_id']);
            $conversation = $this->messagesModel->createConversation($userId, $input['other_user_id']);
            $this->sendSuccess($conversation, 201);
            return;
        }

        // Handle mark as read
        if (strpos($this->route, 'mark-read') !== false) {
            $this->validateRequired($input, ['conversation_id']);
            $this->messagesModel->markConversationAsRead($input['conversation_id'], $userId);
            $this->sendSuccess(['message' => 'Marked as read']);
            return;
        }

        // Send message
        $this->validateRequired($input, ['conversation_id', 'content']);
        
        $input['sender_id'] = $userId;
        // Get recipient from conversation
        $conversation = $this->messagesModel->fetchConversationByUsers($userId, $input['other_user_id'] ?? '');
        if ($conversation) {
            $input['conversation_id'] = $conversation['id'];
            // Determine recipient
            $input['recipient_id'] = $conversation['user_1_id'] === $userId 
                ? $conversation['user_2_id'] 
                : $conversation['user_1_id'];
        }

        $this->messagesModel->sendMessage($input);
        $this->sendSuccess(['message' => 'Message sent'], 201);
    }

    private function handleError(\Exception $e): void
    {
        error_log('MessagesController error: ' . $e->getMessage());

        if (strpos($e->getMessage(), 'Missing') === 0 || strpos($e->getMessage(), 'Invalid') === 0) {
            $this->sendError($e->getMessage(), 400);
        } else {
            $this->sendError('Failed to process request', 500);
        }
    }
}
