<?php
/**
 * Auth Controller
 * Handles authentication routes
 */

require_once __DIR__ . '/../controllers/BaseController.php';
require_once __DIR__ . '/../models/AuthModel.php';

class AuthController extends BaseController
{
    private AuthModel $authModel;

    public function __construct(\PDO $pdo, string $method, string $route)
    {
        parent::__construct($pdo, $method, $route);
        $this->authModel = new AuthModel($pdo);
    }

    public function handle(): void
    {
        try {
            if ($this->method !== 'POST') {
                $this->sendError('Method not allowed', 405);
            }

            if (strpos($this->route, 'auth/register') === 0) {
                $this->handleRegister();
            } elseif (strpos($this->route, 'auth/login') === 0) {
                $this->handleLogin();
            } else {
                $this->sendError('Unknown auth endpoint', 404);
            }
        } catch (\Exception $e) {
            $this->handleError($e);
        }
    }

    private function handleRegister(): void
    {
        $input = $this->getJsonBody();

        // Validate
        $this->validateRequired($input, ['username', 'password', 'email']);
        $this->validateEmail($input['email']);
        $this->validatePassword($input['password']);

        // Check if user exists
        if ($this->authModel->userExists($input['username'], $input['email'])) {
            $this->sendError('Username or Email already exists', 400);
        }

        // Generate ID and hash password
        $id = $this->generateId();
        $passwordHash = password_hash($input['password'], PASSWORD_DEFAULT);
        $avatarUrl = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . urlencode($input['username']);

        // Create user
        $this->authModel->createUser([
            'id' => $id,
            'username' => $input['username'],
            'email' => $input['email'],
            'password_hash' => $passwordHash,
            'avatar_url' => $avatarUrl
        ]);

        // Fetch and return user
        $user = $this->authModel->getUserByUsername($input['username']);
        $this->sendSuccess(['user' => $user], 201);
    }

    private function handleLogin(): void
    {
        $input = $this->getJsonBody();

        // Validate
        $this->validateRequired($input, ['username', 'password']);

        // Fetch user
        $user = $this->authModel->getUserWithPassword($input['username']);

        // Verify credentials
        if (!$user || !password_verify($input['password'], $user['password_hash'])) {
            $this->sendError('Invalid username or password', 401);
        }

        // Return user without password hash
        unset($user['password_hash']);
        $this->sendSuccess(['user' => $user]);
    }

    /**
     * Generate random ID
     */
    private function generateId(): string
    {
        $chars = '0123456789abcdefghijklmnopqrstuvwxyz';
        return 
            substr(str_shuffle($chars), 0, 3) . '-' .
            substr(str_shuffle($chars), 0, 3) . '-' .
            substr(str_shuffle($chars), 0, 3);
    }

    /**
     * Validate email format
     * @throws Exception
     */
    private function validateEmail(string $email): void
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }
    }

    /**
     * Validate password strength
     * @throws Exception
     */
    private function validatePassword(string $password): void
    {
        if (strlen($password) < 6) {
            throw new Exception('Password must be at least 6 characters');
        }
    }

    private function handleError(\Exception $e): void
    {
        error_log('AuthController error: ' . $e->getMessage());

        if (strpos($e->getMessage(), 'Missing') === 0 || 
            strpos($e->getMessage(), 'Invalid') === 0 ||
            strpos($e->getMessage(), 'Password') === 0) {
            $this->sendError($e->getMessage(), 400);
        } else {
            $this->sendError('Authentication failed', 500);
        }
    }
}
