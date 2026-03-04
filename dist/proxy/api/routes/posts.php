<?php
/**
 * Posts Route Handler
 */

$pdo = DB::connect();

// Handle GET requests (Fetch posts)
if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    $sort = $_GET['sort'] ?? 'new'; // 'new', 'top', 'hot'
    $search = $_GET['q'] ?? null;
    
    try {
        $orderBy = "pd.created_at DESC";
        if ($sort === 'top') {
            $orderBy = "pd.upvotes DESC, pd.created_at DESC";
        } elseif ($sort === 'hot') {
            // Simple hot algorithm: (upvotes) / (hours since creation + 2)
            $orderBy = "(pd.upvotes / (TIMESTAMPDIFF(HOUR, pd.created_at, NOW()) + 2)) DESC";
        }

        $query = "
            SELECT pd.*, COALESCE(pv.vote, 0) as user_vote
            FROM post_details pd
            LEFT JOIN post_votes pv ON pd.id = pv.post_id AND pv.user_id = :user_id
        ";

        $params = [':user_id' => $user_id];

        if ($search) {
            $query .= " WHERE pd.title LIKE :search OR pd.content LIKE :search ";
            $params[':search'] = '%' . $search . '%';
        }

        $query .= " ORDER BY $orderBy LIMIT 50";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $posts = $stmt->fetchAll();
        
        sendResponse($posts);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to fetch posts: ' . $e->getMessage()], 500);
    }
}

// Handle POST requests (Create a new post)
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Simple validation
    if (empty($input['id']) || empty($input['title']) || empty($input['author_id']) || empty($input['subreddit_id'])) {
        sendResponse(['error' => 'Missing required fields'], 400);
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO posts (id, author_id, subreddit_id, title, content, image_url, post_type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['id'],
            $input['author_id'],
            $input['subreddit_id'],
            $input['title'],
            $input['content'] ?? null,
            $input['image_url'] ?? null,
            $input['post_type'] ?? 'text'
        ]);

        sendResponse(['success' => true, 'id' => $input['id']], 201);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to create post: ' . $e->getMessage()], 500);
    }
}
