<?php
/**
 * Community Controller
 * Handles community/subreddit routes
 */

require_once __DIR__ . '/../controllers/BaseController.php';
require_once __DIR__ . '/../models/CommunityModel.php';

class CommunityController extends BaseController
{
    private CommunityModel $communityModel;

    public function __construct(\PDO $pdo, string $method, string $route)
    {
        parent::__construct($pdo, $method, $route);
        $this->communityModel = new CommunityModel($pdo);
    }

    public function handle(): void
    {
        try {
            if ($this->method === 'GET') {
                $this->handleGet();
            } elseif ($this->method === 'POST') {
                $this->handlePost();
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
        $search = $this->getParam('q');

        // Check if requesting specific community (e.g., /communities/name)
        if (preg_match('/^communities\/([^\/]+)/', $this->route, $matches) && !in_array($matches[1], ['create', 'join', 'leave'], true)) {
            $idOrName = $matches[1];
            $community = $this->communityModel->fetchCommunity($idOrName, $userId);
            if (!$community) {
                $this->sendError('Community not found', 404);
            }
            $this->sendSuccess($community);
            return;
        }

        // Check if requesting user memberships
        if (($this->route === 'memberships' || $this->route === 'communities/memberships') && $userId) {
            $memberships = $this->communityModel->getUserMemberships($userId);
            $this->sendSuccess($memberships);
            return;
        }

        // Fetch all communities with optional search
        $communities = $this->communityModel->fetchCommunities($search);
        $this->sendSuccess($communities);
    }

    private function handlePost(): void
    {
        $input = $this->getJsonBody();
        $userId = $this->getParam('user_id') ?: ($input['user_id'] ?? null);

        if (strpos($this->route, 'create') !== false || $this->route === 'communities') {
            $this->validateRequired($input, ['name']);
            if (!$userId) {
                $this->sendError('User ID required', 400);
            }

            $communityId = $input['id'] ?? $this->generateId();
            $this->communityModel->createCommunity([
                'id' => $communityId,
                'name' => $input['name'],
                'description' => $input['description'] ?? null,
                'icon_url' => $input['icon_url'] ?? null,
                'banner_url' => $input['banner_url'] ?? null,
                'creator_id' => $userId,
                'owner_id' => $userId,
            ]);

            $this->communityModel->joinCommunity($communityId, $userId);
            $created = $this->communityModel->fetchCommunity($communityId, $userId);
            $this->sendSuccess($created ?? ['id' => $communityId], 201);
            return;
        }

        // Handle different POST operations
        if (strpos($this->route, 'join') !== false) {
            $communityId = $input['community_id'] ?? $input['subreddit_id'] ?? null;
            if (!$communityId) {
                $this->sendError('Missing community_id', 400);
            }
            if (!$userId) {
                $this->sendError('User ID required', 400);
            }
            $community = $this->communityModel->fetchCommunity($communityId, $userId);
            if (!$community) {
                $this->sendError('Community not found', 404);
            }
            $this->communityModel->joinCommunity($communityId, $userId);
            $this->sendSuccess(['message' => 'Successfully joined community'], 201);
            return;
        }

        if (strpos($this->route, 'leave') !== false) {
            $communityId = $input['community_id'] ?? $input['subreddit_id'] ?? null;
            if (!$communityId) {
                $this->sendError('Missing community_id', 400);
            }
            if (!$userId) {
                $this->sendError('User ID required', 400);
            }

            $community = $this->communityModel->fetchCommunity($communityId, $userId);
            if (!$community) {
                $this->sendError('Community not found', 404);
            }

            $ownerId = $community['owner_id'] ?? null;
            $creatorId = $community['creator_id'] ?? null;
            if ($ownerId === $userId || $creatorId === $userId) {
                $this->sendError('Owner cannot leave community', 403);
            }

            $role = $this->communityModel->getMembershipRole($communityId, $userId);
            if (!$role) {
                $this->sendError('Not a community member', 400);
            }

            $this->communityModel->leaveCommunity($communityId, $userId);
            $this->sendSuccess(['message' => 'Successfully left community']);
            return;
        }

        $this->sendError('Invalid community action', 400);
    }

    private function handleDelete(): void
    {
        if (!preg_match('/^communities\/([^\/]+)/', $this->route, $matches)) {
            $this->sendError('Invalid delete route', 400);
        }

        $communityId = $matches[1];
        $userId = $this->getParam('user_id');
        if (!$userId) {
            $this->sendError('User ID required', 400);
        }

        $community = $this->communityModel->fetchCommunity($communityId, $userId);
        if (!$community) {
            $this->sendError('Community not found', 404);
        }

        $role = $this->communityModel->getMembershipRole($community['id'], $userId);
        $isOwner = ($community['owner_id'] ?? null) === $userId || ($community['creator_id'] ?? null) === $userId;
        $canManage = $isOwner || in_array($role, ['moderator', 'admin'], true);
        if (!$canManage) {
            $this->sendError('Insufficient permissions', 403);
        }

        $this->communityModel->deleteCommunity($community['id']);
        $this->sendSuccess(['message' => 'Community deleted']);
    }

    private function generateId(): string
    {
        $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        $part = function () use ($chars): string {
            $out = '';
            for ($i = 0; $i < 3; $i++) {
                $out .= $chars[random_int(0, strlen($chars) - 1)];
            }
            return $out;
        };

        return $part() . '-' . $part() . '-' . $part();
    }

    private function handleError(\Exception $e): void
    {
        error_log('CommunityController error: ' . $e->getMessage());

        if (strpos($e->getMessage(), 'Missing') === 0 || strpos($e->getMessage(), 'Invalid') === 0) {
            $this->sendError($e->getMessage(), 400);
        } else {
            $this->sendError('Failed to process request', 500);
        }
    }
}
