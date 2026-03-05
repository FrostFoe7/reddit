<?php
/**
 * Post Controller
 * Handles POST route logic
 */

require_once __DIR__ . '/../controllers/BaseController.php';
require_once __DIR__ . '/../models/PostModel.php';

class PostController extends BaseController
{
    private PostModel $postModel;

    public function __construct(\PDO $pdo, string $method, string $route)
    {
        parent::__construct($pdo, $method, $route);
        $this->postModel = new PostModel($pdo);
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
        $sort = $this->getParam('sort', 'new');
        $search = $this->getParam('q');

        // Validate sort parameter
        if (!in_array($sort, ['new', 'top', 'hot'], true)) {
            $sort = 'new';
        }

        $posts = $this->postModel->fetchPosts($userId, $sort, $search);
        $this->sendSuccess($posts);
    }

    private function handlePost(): void
    {
        $input = $this->getJsonBody();

        // Validate required fields
        $this->validateRequired($input, ['id', 'title', 'author_id', 'subreddit_id']);

        // Create post
        $this->postModel->createPost($input);
        $this->sendSuccess(['id' => $input['id']], 201);
    }

    private function handleError(\Exception $e): void
    {
        // Log error for debugging (in production, log to file)
        error_log('PostController error: ' . $e->getMessage());

        // Return safe error message to client
        if (strpos($e->getMessage(), 'Missing') === 0 || strpos($e->getMessage(), 'Invalid') === 0) {
            $this->sendError($e->getMessage(), 400);
        } else {
            $this->sendError('Failed to process request', 500);
        }
    }
}
