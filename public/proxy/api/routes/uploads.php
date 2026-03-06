<?php
/**
 * Uploads Route Handler
 * POST /api/uploads - accepts multipart file and optimizes images to web formats.
 */

$pdo = DB::connect();

if ($method !== 'POST' || strpos($route, 'uploads') !== 0) {
    sendResponse(['error' => 'Unsupported upload request'], 405);
}

if (!isset($_FILES['file'])) {
    sendResponse(['error' => 'No upload file provided'], 400);
}

$file = $_FILES['file'];
if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
    sendResponse(['error' => 'Invalid upload payload'], 400);
}

$mime = mime_content_type($file['tmp_name']) ?: '';
if (strpos($mime, 'image/') !== 0) {
    sendResponse(['error' => 'Only image uploads are supported'], 400);
}

$uploadsDir = realpath(__DIR__ . '/../../') . '/uploads';
if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0755, true) && !is_dir($uploadsDir)) {
    sendResponse(['error' => 'Failed to initialize uploads directory'], 500);
}

$basename = date('YmdHis') . '-' . bin2hex(random_bytes(4));
$tmpFile = $file['tmp_name'];

$nodeBin = trim((string)shell_exec('command -v node 2>/dev/null'));
$script = realpath(__DIR__ . '/../../../../scripts/optimize-upload.mjs');
$optimizedName = $basename . '.webp';
$optimizedPath = $uploadsDir . '/' . $optimizedName;

$uploadedUrl = null;

if ($nodeBin !== '' && $script && file_exists($script)) {
    $cmd = escapeshellarg($nodeBin) . ' ' . escapeshellarg($script) . ' ' . escapeshellarg($tmpFile) . ' ' . escapeshellarg($optimizedPath);
    $output = [];
    $status = 0;
    exec($cmd, $output, $status);

    if ($status === 0 && file_exists($optimizedPath)) {
        $uploadedUrl = '/proxy/uploads/' . $optimizedName;
    }
}

if ($uploadedUrl === null) {
    $ext = pathinfo((string)$file['name'], PATHINFO_EXTENSION);
    $ext = $ext ? strtolower($ext) : 'jpg';
    $fallbackName = $basename . '.' . $ext;
    $fallbackPath = $uploadsDir . '/' . $fallbackName;

    if (!move_uploaded_file($tmpFile, $fallbackPath)) {
        sendResponse(['error' => 'Failed to store uploaded file'], 500);
    }

    $uploadedUrl = '/proxy/uploads/' . $fallbackName;
}

sendResponse([
    'success' => true,
    'url' => $uploadedUrl,
]);
