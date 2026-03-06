-- Backfill and harden subreddits media/creator metadata and uniqueness.

-- Ensure optional icon_url exists.
SET @col_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'subreddits'
    AND COLUMN_NAME = 'icon_url'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE subreddits ADD COLUMN icon_url TEXT NULL AFTER description',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ensure optional banner_url exists.
SET @col_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'subreddits'
    AND COLUMN_NAME = 'banner_url'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE subreddits ADD COLUMN banner_url TEXT NULL AFTER icon_url',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ensure creator_id exists.
SET @col_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'subreddits'
    AND COLUMN_NAME = 'creator_id'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE subreddits ADD COLUMN creator_id VARCHAR(11) NULL AFTER owner_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Keep creator_id aligned with owner_id for legacy rows.
UPDATE subreddits
SET creator_id = owner_id
WHERE creator_id IS NULL;

-- Ensure creator index exists.
SET @idx_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'subreddits'
    AND INDEX_NAME = 'idx_subreddits_creator_id'
);
SET @sql := IF(
  @idx_exists = 0,
  'ALTER TABLE subreddits ADD INDEX idx_subreddits_creator_id (creator_id)',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ensure FK exists.
SET @fk_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND CONSTRAINT_NAME = 'fk_subreddits_creator'
    AND TABLE_NAME = 'subreddits'
);
SET @sql := IF(
  @fk_exists = 0,
  'ALTER TABLE subreddits ADD CONSTRAINT fk_subreddits_creator FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ensure stable unique constraint for subreddit names.
SET @uq_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'subreddits'
    AND COLUMN_NAME = 'name'
    AND NON_UNIQUE = 0
);
SET @sql := IF(
  @uq_exists = 0,
  'ALTER TABLE subreddits ADD UNIQUE KEY uq_subreddits_name (name)',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
