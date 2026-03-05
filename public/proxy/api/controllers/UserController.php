<?php
/**
 * User Controller
 * Handles user routes
 */

require_once __DIR__ . '/../controllers/BaseController.php';
require_once __DIR__ . '/../models/UserModel.php';

class UserController extends BaseController
{
    private UserModel $model;

    public function __construct(\PDO $pdo, string $method, string $route)
    {
        parent::__construct($pdo, $method, $route);
        $this->model = new UserModel($pdo);
    }

    public function handle(): void
    {
        try {
            if ($this->method !== 'GET') {
                $this->sendError('Method not allowed', 405);
            }

            $userId = $this->getParam('id');
            $username = $this->getParam('username');

            if ($userId) {
                $user = $this->model->fetchUserById($userId);
                if (!$user) {
                    $this->sendError('User not found', 404);
                }
                $this->sendSuccess($user);
            } elseif ($username) {
                $user = $this->model->fetchUserByUsername($username);
                if (!$user) {
                    $this->sendError('User not found', 404);
                }
                $this->sendSuccess($user);
            } else {
                // List all users
                $users = $this->model->fetchAllUsers();
                $this->sendSuccess($users);
            }
        } catch (\Exception $e) {
            $this->handleError($e);
        }
    }

    private function handleError(\Exception $e): void
    {
        error_log('UserController error: ' . $e->getMessage());
        $this->sendError('Failed to fetch users', 500);
    }
}
