# Database Migrations

This folder contains the PostgreSQL database schema and initial seed data for the Reddit v2 project.

## Files

1.  `001_initial_schema.sql`: Creates all necessary tables, indexes, and views.
2.  `002_seed_data.sql`: Populates the database with the initial mock data (users, subreddits, posts, etc.).

## How to use on cPanel

To set up the database on a cPanel hosting environment:

1.  **Create the Database**:
    - Log in to your cPanel.
    - Go to **PostgreSQL Databases**.
    - Create a new database (e.g., `youruser_reddit_v2`).
    - Create a new database user and assign them to the database with all privileges.

2.  **Import the Schema**:
    - Go back to the cPanel home and open **phpPgAdmin** (or use the command line if you have SSH access).
    - Select your newly created database.
    - Click on the **SQL** tab.
    - Upload and execute `001_initial_schema.sql` first.
    - Then, upload and execute `002_seed_data.sql`.

## Schema Highlights

- **UUIDs**: Used for all primary keys to ensure global uniqueness and opaque IDs.
- **Normalization**: Tables are normalized to reduce redundancy.
- **Views**: Included `post_details` and `comment_details` views to easily fetch counts (upvotes, comments) and author information without complex manual joins in your application code.
- **Indexes**: Critical columns (usernames, foreign keys, timestamps) are indexed for high performance.
- **Relationships**: Full referential integrity with appropriate `ON DELETE CASCADE` or `SET NULL` actions.
