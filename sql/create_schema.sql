# TODO: Use flyway or a real migration tool

# Use a default database
USE mysql;

# Drop any existing databases if applicable
DROP DATABASE workouts;

# Create workouts database
CREATE DATABASE workouts
    CHARACTER SET utf8
    COLLATE utf8_general_ci;

# Create users table in workouts database
CREATE TABLE workouts.users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE KEY,
    password_hash VARCHAR(255) NOT NULL);

# Create workouts table in workouts database
CREATE TABLE workouts.workouts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE KEY,
    squats INT UNSIGNED,
    bench_press INT UNSIGNED,
    barbell_rows INT UNSIGNED,
    overhead_press INT UNSIGNED,
    deadlifts INT UNSIGNED,
    user_id INT UNSIGNED NOT NULL,
    FOREIGN KEY(user_id) REFERENCES workouts.users(id));

# Grant all privileges to the workouts database to the workout tracker app
GRANT ALL ON workouts.* to 'workout_tracker'@'localhost';
