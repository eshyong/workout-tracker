# Add user emails to the users table
ALTER TABLE users
    ADD COLUMN email VARCHAR(255) NOT NULL UNIQUE KEY;
