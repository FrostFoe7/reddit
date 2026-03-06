-- Add creator tracking to existing subreddits table for backward-compatible upgrades.

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

-- Drop the FK first if it already exists so ALTER/MODIFY does not fail in MariaDB.
SET @fk_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND CONSTRAINT_NAME = 'fk_subreddits_creator'
    AND TABLE_NAME = 'subreddits'
);
SET @sql := IF(
  @fk_exists = 1,
  'ALTER TABLE subreddits DROP FOREIGN KEY fk_subreddits_creator',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Keep creator_id compatible with users.id from the base schema.
ALTER TABLE subreddits
MODIFY creator_id VARCHAR(11) NULL;

UPDATE subreddits
SET creator_id = owner_id
WHERE creator_id IS NULL;

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
