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
        $this->method = $this->resolveMethod();
        $this->route = $this->extractRoute();
    }

    private function resolveMethod(): string
    {
        $method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));
        if ($method !== 'POST') {
            return $method;
        }

        $override = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? ($_GET['_method'] ?? null);
        if (!is_string($override) || $override === '') {
            return $method;
        }

        $normalized = strtoupper(trim($override));
        if (in_array($normalized, ['PUT', 'PATCH', 'DELETE'], true)) {
            return $normalized;
        }

        return $method;
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
            'uploads' => 'uploads.php',
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
                header('Content-Type: application/json');

                if ($code >= 400) {
                    $message = 'Request failed';
                    if (is_array($data) && isset($data['error']) && is_string($data['error'])) {
                        $message = $data['error'];
                    } elseif (is_array($data) && isset($data['message']) && is_string($data['message'])) {
                        $message = $data['message'];
                    } elseif (is_string($data) && $data !== '') {
                        $message = $data;
                    }

                    echo json_encode([
                        'success' => false,
                        'message' => $message,
                        'error' => $message,
                        'data' => null,
                    ], JSON_UNESCAPED_SLASHES);
                    exit;
                }

                echo json_encode([
                    'success' => true,
                    'data' => $data,
                ], JSON_UNESCAPED_SLASHES);
                exit;
            }
        }

        require $file;
    }

    private function handleStatus(): void
    {
        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => [
                'status' => 'online',
                'timestamp' => date('Y-m-d H:i:s'),
            ],
        ], JSON_UNESCAPED_SLASHES);
        exit;
    }

    private function sendNotFound(): void
    {
        $this->sendError('Endpoint not found', 404);
    }

    private function sendError(string $message, int $statusCode): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => $message,
            'error' => $message,
            'data' => null,
        ], JSON_UNESCAPED_SLASHES);
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
    header('Content-Type: application/json', true, 500);
    if (isset($_GET['debug']) && $_GET['debug'] === '1') {
        echo json_encode([
            'success' => false,
            'message' => 'API bootstrap failed: ' . $e->getMessage(),
            'error' => 'API bootstrap failed: ' . $e->getMessage(),
            'data' => null,
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed',
            'error' => 'Database connection failed',
            'data' => null,
        ]);
    }
    exit;
}
