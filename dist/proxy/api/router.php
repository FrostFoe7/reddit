<?php
/**
 * API Router
 * Dispatches requests to route handlers under api/routes.
 */

require_once __DIR__ . '/../config/db.php';

class ApiRouter
{
    /** @var \PDO */
    private $pdo;
    /** @var string */
    private $method;
    /** @var string */
    private $route;

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

    public function dispatch(): void
    {
        try {
            if ($this->route === 'status') {
                $this->handleStatus();
                return;
            }

            $legacyRouteFile = $this->resolveLegacyRouteFile();
            if (!$legacyRouteFile) {
                $this->sendNotFound();
            }

            $this->dispatchLegacy($legacyRouteFile);
        } catch (\Throwable $e) {
            error_log('API dispatch error: ' . $e->getMessage());
            if (isset($_GET['debug']) && $_GET['debug'] === '1') {
                $this->sendError('Internal server error: ' . $e->getMessage(), 500);
            }
            $this->sendError('Internal server error', 500);
        }
    }

    private function resolveLegacyRouteFile(): ?string
    {
        $map = [
            'auth' => 'auth.php',
            'posts' => 'posts.php',
            'comments' => 'comments.php',
            'votes' => 'votes.php',
            'users' => 'users.php',
            'communities' => 'communities.php',
            'messages' => 'messages.php',
            'notifications' => 'notifications.php',
        ];

        if (strpos($this->route, 'users/memberships') === 0 || strpos($this->route, 'memberships') === 0) {
            return __DIR__ . '/routes/users.php';
        }

        foreach ($map as $prefix => $fileName) {
            if (strpos($this->route, $prefix) === 0) {
                return __DIR__ . '/routes/' . $fileName;
            }
        }

        return null;
    }

    private function dispatchLegacy(string $file): void
    {
        if (!file_exists($file)) {
            $this->sendNotFound();
        }

        $pdo = $this->pdo;
        $method = $this->method;
        $route = $this->route;

        if (!function_exists('sendResponse')) {
            function sendResponse($data, $code = 200) {
                http_response_code($code);
                echo json_encode($data, JSON_UNESCAPED_SLASHES);
                exit;
            }
        }

        require $file;
    }

    private function handleStatus(): void
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
} catch (\Throwable $e) {
    error_log("API bootstrap failed: " . $e->getMessage());
    http_response_code(500);
    if (isset($_GET['debug']) && $_GET['debug'] === '1') {
        echo json_encode(['error' => 'API bootstrap failed: ' . $e->getMessage()]);
    } else {
        echo json_encode(['error' => 'Database connection failed']);
    }
    exit;
}
