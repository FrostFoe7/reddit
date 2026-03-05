<?php
/**
 * Vote Controller
 * Handles voting routes
 */

require_once __DIR__ . '/../controllers/BaseController.php';
require_once __DIR__ . '/../models/VoteModel.php';

class VoteController extends BaseController
{
    private VoteModel $model;

    public function __construct(\PDO $pdo, string $method, string $route)
    {
        parent::__construct($pdo, $method, $route);
        $this->model = new VoteModel($pdo);
    }

    public function handle(): void
    {
        try {
            if ($this->method === 'POST') {
                $this->handleVote();
            } else {
                $this->sendError('Method not allowed', 405);
            }
        } catch (\Exception $e) {
            $this->handleError($e);
        }
    }

    private function handleVote(): void
    {
        $input = $this->getJsonBody();

        $this->validateRequired($input, ['type', 'target_id', 'vote', 'user_id']);

        $type = $input['type'];
        $targetId = $input['target_id'];
        $vote = (int)$input['vote'];
        $userId = $input['user_id'];

        // Validate vote value
        if (!in_array($vote, [-1, 0, 1], true)) {
            $this->sendError('Vote must be -1, 0, or 1', 400);
        }

        // Process vote
        if ($type === 'post') {
            $this->model->votePost($userId, $targetId, $vote);
        } elseif ($type === 'comment') {
            $this->model->voteComment($userId, $targetId, $vote);
        } else {
            $this->sendError('Invalid vote type', 400);
        }

        $this->sendSuccess(['success' => true], 200);
    }

    private function handleError(\Exception $e): void
    {
        error_log('VoteController error: ' . $e->getMessage());

        if (strpos($e->getMessage(), 'Missing') === 0 || strpos($e->getMessage(), 'Invalid') === 0) {
            $this->sendError($e->getMessage(), 400);
        } else {
            $this->sendError('Failed to process vote', 500);
        }
    }
}
