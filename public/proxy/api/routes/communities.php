<?php
/**
 * Communities Route Handler
 */

$pdo = DB::connect();

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM subreddits ORDER BY name ASC");
        $communities = $stmt->fetchAll();
        sendResponse($communities);
    } catch (\Exception $e) {
        sendResponse(['error' => 'Failed to fetch communities: ' . $e->getMessage()], 500);
    }
}
