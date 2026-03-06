# Database Migrations (MySQL)

This folder contains the MySQL database schema and initial seed data for the Reddit v2 project.

## Files

1.  `001_initial_schema.sql`: Creates all necessary tables, indexes, and views.
2.  `002_seed_data.sql`: Populates the database with initial sample data using the custom ID format.
3.  `003_add_subreddits_creator_id.sql`: Backward-compatible migration that adds and backfills `subreddits.creator_id` for existing databases.

## How to use on cPanel

To set up the database on a cPanel hosting environment:

1.  **Create the Database**:
    - Log in to your cPanel.
    - Go to **MySQL® Databases**.
    - Create a new database (e.g., `youruser_reddit_v2`).
    - Create a new database user and assign them to the database with all privileges.

2.  **Import the Schema**:
    - Go back to the cPanel home and open **phpMyAdmin**.
    - Select your newly created database from the left sidebar.
    - Click on the **Import** tab.
    - Upload and execute `001_initial_schema.sql` first.
    - Then, upload and execute `002_seed_data.sql`.
    - If upgrading an existing deployment, upload and execute `003_add_subreddits_creator_id.sql`.

## Schema Highlights

- **Custom IDs**: All primary keys follow the `xxx-xxx-xxx` format (e.g., `1bw-j2k-e39`).
- **MySQL Optimized**: Uses `VARCHAR(11)` for IDs, `JSON` for settings, and `FULLTEXT` indexes for high-speed content searching.
- **Views**: Included `post_details` and `comment_details` views to easily fetch counts (upvotes, comments) and author information without complex manual joins in your application code.
- **Relationships**: Full referential integrity with appropriate `ON DELETE CASCADE` or `SET NULL` actions.
