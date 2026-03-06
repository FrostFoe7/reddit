<?php
/**
 * Notifications Controller
 * Handles notifications
 */

require_once __DIR__ . '/../controllers/BaseController.php';
require_once __DIR__ . '/../models/NotificationsModel.php';

class NotificationsController extends BaseController
{
    private NotificationsModel $notificationsModel;

    public function __construct(\PDO $pdo, string $method, string $route)
    {
        parent::__construct($pdo, $method, $route);
        $this->notificationsModel = new NotificationsModel($pdo);
    }

    public function handle(): void
    {
        try {
            if ($this->method === 'GET') {
                $this->handleGet();
            } elseif ($this->method === 'POST') {
                $this->handlePost();
            } elseif ($this->method === 'PUT') {
                $this->handlePut();
            } elseif ($this->method === 'DELETE') {
                $this->handleDelete();
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

        // Check if requesting unread count
        if (strpos($this->route, 'count') !== false) {
            $count = $this->notificationsModel->getUnreadCount($userId);
            $this->sendSuccess(['unread_count' => $count]);
            return;
        }

        // Fetch all notifications
        $notifications = $this->notificationsModel->fetchNotifications($userId);
        $this->sendSuccess($notifications);
    }

    private function handlePost(): void
    {
        $input = $this->getJsonBody();
        $userId = $this->getParam('user_id');

        if (!$userId) {
            $this->sendError('User ID required', 400);
        }

        // Handle mark all as read
        if (strpos($this->route, 'mark-all-read') !== false) {
            $this->notificationsModel->markAllAsRead($userId);
            $this->sendSuccess(['message' => 'All notifications marked as read']);
            return;
        }

        // Create notification (admin/system only)
        $this->validateRequired($input, ['recipient_id', 'type', 'text']);
        $this->notificationsModel->createNotification($input);
        $this->sendSuccess(['message' => 'Notification created'], 201);
    }

    private function handlePut(): void
    {
        $input = $this->getJsonBody();

        // Mark single notification as read
        if (preg_match('/^notifications\/([^\/]+)/', $this->route, $matches)) {
            $notificationId = $matches[1];
            $this->notificationsModel->markAsRead($notificationId);
            $this->sendSuccess(['message' => 'Notification marked as read']);
            return;
        }

        $this->sendError('Invalid request', 400);
    }

    private function handleDelete(): void
    {
        // Delete single notification
        if (preg_match('/^notifications\/([^\/]+)/', $this->route, $matches)) {
            $notificationId = $matches[1];
            $this->notificationsModel->deleteNotification($notificationId);
            $this->sendSuccess(['message' => 'Notification deleted']);
            return;
        }

        $this->sendError('Invalid request', 400);
    }

    private function handleError(\Exception $e): void
    {
        error_log('NotificationsController error: ' . $e->getMessage());

        if (strpos($e->getMessage(), 'Missing') === 0 || strpos($e->getMessage(), 'Invalid') === 0) {
            $this->sendError($e->getMessage(), 400);
        } else {
            $this->sendError('Failed to process request', 500);
        }
    }
}
