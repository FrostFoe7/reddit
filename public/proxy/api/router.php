<?php
/**
 * Improved API Router with MVC Architecture
 * Dispatch requests to appropriate controllers
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../controllers/PostController.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/CommentController.php';
require_once __DIR__ . '/../controllers/VoteController.php';
require_once __DIR__ . '/../controllers/UserController.php';

class ApiRouter
{
    private \PDO $pdo;
    private string $method;
    private string $route;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->route = $this->extractRoute();
    }

    /**
     * Extract API route from request URI
     */
    private function extractRoute(): string
    {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        // Remove /api/ prefix to get the route
        return preg_replace('/^.*\/api\/?/', '', $path);
    }

    /**
     * Route request to appropriate controller
     */
    public function dispatch(): void
    {
        try {
            $controller = $this->getController();
            if (!$controller) {
                $this->sendNotFound();
            }
            $controller->handle();
        } catch (\Exception $e) {
            $this->sendError('Internal server error', 500);
        }
    }

    /**
     * Get controller for route
     */
    private function getController(): ?object
    {
        if (strpos($this->route, 'posts') === 0) {
            return new PostController($this->pdo, $this->method, $this->route);
        } elseif (strpos($this->route, 'auth') === 0) {
            return new AuthController($this->pdo, $this->method, $this->route);
        } elseif (strpos($this->route, 'comments') === 0) {
            return new CommentController($this->pdo, $this->method, $this->route);
        } elseif (strpos($this->route, 'votes') === 0) {
            return new VoteController($this->pdo, $this->method, $this->route);
        } elseif (strpos($this->route, 'users') === 0) {
            return new UserController($this->pdo, $this->method, $this->route);
        } elseif ($this->route === 'status') {
            return $this->getStatusController();
        }

        // TODO: Implement remaining routes (communities, messages, notifications)
        // For now, fall back to old route files if available
        return $this->getLegacyController();
    }

    /**
     * Get legacy controller for old route files
     * Temporary fallback until all routes are refactored
     */
    private function getLegacyController(): ?object
    {
        $legacyRoutes = ['communities', 'messages', 'notifications'];
        
        foreach ($legacyRoutes as $legacyRoute) {
            if (strpos($this->route, $legacyRoute) === 0) {
                $file = __DIR__ . '/routes/' . $legacyRoute . '.php';
                if (file_exists($file)) {
                    // Return a wrapper controller that includes the old route file
                    $pdo = $this->pdo;
                    $method = $this->method;
                    $route = $this->route;
                    
                    return new class($pdo, $method, $route, $file) {
                        private $pdo;
                        private $method;
                        private $route;
                        private $file;

                        public function __construct($pdo, $method, $route, $file)
                        {
                            $this->pdo = $pdo;
                            $this->method = $method;
                            $this->route = $route;
                            $this->file = $file;
                        }

                        public function handle(): void
                        {
                            $pdo = $this->pdo;
                            $method = $this->method;
                            $route = $this->route;
                            
                            function sendResponse($data, $code = 200) {
                                http_response_code($code);
                                echo json_encode($data);
                                exit;
                            }

                            require_once $this->file;
                        }
                    };
                }
            }
        }

        return null;
    }

    /**
     * Status endpoint controller (inline)
     */
    private function getStatusController(): object
    {
        return new class {
            public function handle(): void
            {
                http_response_code(200);
                echo json_encode([
                    'data' => [
                        'status' => 'online',
                        'timestamp' => date('Y-m-d H:i:s')
                    ]
                ]);
                exit;
            }
        };
    }

    private function sendNotFound(): void
    {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        exit;
    }

    private function sendError(string $message, int $statusCode): void
    {
        http_response_code($statusCode);
        echo json_encode(['error' => $message]);
        exit;
    }
}

// Bootstrap
try {
    $pdo = DB::connect();
    $router = new ApiRouter($pdo);
    $router->dispatch();
} catch (\PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
