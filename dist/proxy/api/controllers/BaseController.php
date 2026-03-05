<?php
/**
 * Base Controller Class
 * Provides common response handling and validation
 */

abstract class BaseController
{
    protected \PDO $pdo;
    protected string $method;
    protected string $route;

    public function __construct(\PDO $pdo, string $method, string $route)
    {
        $this->pdo = $pdo;
        $this->method = $method;
        $this->route = $route;
    }

    /**
     * Send JSON success response
     */
    protected function sendSuccess($data = null, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        echo json_encode(['data' => $data], JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * Send JSON error response
     */
    protected function sendError(string $message, int $statusCode = 400): void
    {
        http_response_code($statusCode);
        echo json_encode(['error' => $message], JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * Validate required fields in input
     * @throws Exception
     */
    protected function validateRequired(array $data, array $fields): void
    {
        $missing = [];
        foreach ($fields as $field) {
            if (empty($data[$field] ?? null)) {
                $missing[] = $field;
            }
        }

        if (!empty($missing)) {
            throw new Exception('Missing required fields: ' . implode(', ', $missing));
        }
    }

    /**
     * Validate numeric ID
     * @throws Exception
     */
    protected function validateId($id): void
    {
        if (empty($id) || !is_string($id)) {
            throw new Exception('Invalid ID format');
        }
    }

    /**
     * Get JSON request body
     */
    protected function getJsonBody(): array
    {
        $body = file_get_contents('php://input');
        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON in request body');
        }

        return $data ?? [];
    }

    /**
     * Get query parameter
     */
    protected function getParam(string $name, $default = null)
    {
        return $_GET[$name] ?? $default;
    }

    /**
     * Dispatch request to appropriate handler
     */
    abstract public function handle(): void;
}
