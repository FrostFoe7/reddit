<?php
/**
 * Comment Controller
 * Handles comments routes
 */

require_once __DIR__ . '/../controllers/BaseController.php';
require_once __DIR__ . '/../models/CommentModel.php';

class CommentController extends BaseController
{
    private CommentModel $model;

    public function __construct(\PDO $pdo, string $method, string $route)
    {
        parent::__construct($pdo, $method, $route);
        $this->model = new CommentModel($pdo);
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
        $postId = $this->getParam('postId');
        $userId = $this->getParam('user_id');

        if (empty($postId)) {
            $this->sendError('Missing postId parameter', 400);
        }

        $comments = $this->model->fetchCommentsByPost($postId, $userId);
        $this->sendSuccess($comments);
    }

    private function handlePost(): void
    {
        $input = $this->getJsonBody();
        $this->validateRequired($input, ['id', 'post_id', 'author_id', 'content']);

        $this->model->createComment($input);
        $this->sendSuccess(['id' => $input['id']], 201);
    }

    private function handleError(\Exception $e): void
    {
        error_log('CommentController error: ' . $e->getMessage());

        if (strpos($e->getMessage(), 'Missing') === 0 || strpos($e->getMessage(), 'Invalid') === 0) {
            $this->sendError($e->getMessage(), 400);
        } else {
            $this->sendError('Failed to process request', 500);
        }
    }
}
