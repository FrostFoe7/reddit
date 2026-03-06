<?php
/**
 * Shared auth helpers for legacy route handlers.
 */

if (!function_exists('apiAuthEnv')) {
    function apiAuthEnv(string $key, ?string $default = null): ?string
    {
        $value = getenv($key);
        if ($value !== false && $value !== null && $value !== '') {
            return (string)$value;
        }

        if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
            return (string)$_ENV[$key];
        }

        if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') {
            return (string)$_SERVER[$key];
        }

        return $default;
    }
}

if (!function_exists('getAuthSecret')) {
    function getAuthSecret(): string
    {
        return apiAuthEnv('AUTH_TOKEN_SECRET', 'project_reddit_v2_default_secret_change_me');
    }
}

if (!function_exists('b64urlEncode')) {
    function b64urlEncode(string $input): string
    {
        return rtrim(strtr(base64_encode($input), '+/', '-_'), '=');
    }
}

if (!function_exists('b64urlDecode')) {
    function b64urlDecode(string $input): string
    {
        $remainder = strlen($input) % 4;
        if ($remainder > 0) {
            $input .= str_repeat('=', 4 - $remainder);
        }
        return (string)base64_decode(strtr($input, '-_', '+/'));
    }
}

if (!function_exists('issueAuthToken')) {
    function issueAuthToken(string $userId, int $ttlSeconds = 86400): string
    {
        $payload = [
            'sub' => $userId,
            'iat' => time(),
            'exp' => time() + $ttlSeconds,
        ];

        $payloadRaw = json_encode($payload, JSON_UNESCAPED_SLASHES);
        $encoded = b64urlEncode($payloadRaw ?: '{}');
        $signature = hash_hmac('sha256', $encoded, getAuthSecret(), true);

        return $encoded . '.' . b64urlEncode($signature);
    }
}

if (!function_exists('getBearerToken')) {
    function getBearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['Authorization'] ?? null;
        if (!$header && function_exists('getallheaders')) {
            $headers = getallheaders();
            $header = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        }

        if (!is_string($header)) {
            return null;
        }

        if (!preg_match('/^Bearer\s+(.+)$/i', trim($header), $matches)) {
            return null;
        }

        return trim((string)$matches[1]);
    }
}

if (!function_exists('resolveTokenUserId')) {
    function resolveTokenUserId(?string $token): ?string
    {
        if (!$token) {
            return null;
        }

        $parts = explode('.', $token, 2);
        if (count($parts) !== 2) {
            return null;
        }

        [$encodedPayload, $encodedSignature] = $parts;
        $expected = b64urlEncode(hash_hmac('sha256', $encodedPayload, getAuthSecret(), true));
        if (!hash_equals($expected, $encodedSignature)) {
            return null;
        }

        $payload = json_decode(b64urlDecode($encodedPayload), true);
        if (!is_array($payload)) {
            return null;
        }

        $sub = $payload['sub'] ?? null;
        $exp = isset($payload['exp']) ? (int)$payload['exp'] : 0;
        if (!is_string($sub) || $sub === '' || $exp < time()) {
            return null;
        }

        return $sub;
    }
}

if (!function_exists('requireAuthenticatedUserId')) {
    function extractLegacyUserId(array $input = []): ?string
    {
        $candidates = [
            $input['user_id'] ?? null,
            $input['author_id'] ?? null,
            $input['sender_id'] ?? null,
            $input['actor_id'] ?? null,
            $_GET['user_id'] ?? null,
            $_GET['author_id'] ?? null,
            $_GET['sender_id'] ?? null,
            $_GET['actor_id'] ?? null,
        ];

        foreach ($candidates as $candidate) {
            if (is_string($candidate) && $candidate !== '') {
                return $candidate;
            }
        }

        return null;
    }

    function requireAuthenticatedUserId(array $input = [], bool $allowLegacyFallback = true): string
    {
        $tokenUserId = resolveTokenUserId(getBearerToken());
        $legacyUserId = extractLegacyUserId($input);

        if ($tokenUserId) {
            if ($legacyUserId && $legacyUserId !== $tokenUserId) {
                sendResponse(['error' => 'Authenticated user mismatch'], 403);
            }
            return $tokenUserId;
        }

        if ($allowLegacyFallback && is_string($legacyUserId) && $legacyUserId !== '') {
            return $legacyUserId;
        }

        sendResponse(['error' => 'Authentication required'], 401);
    }
}
