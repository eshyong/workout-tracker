# Use a default database
USE mysql;

# Create workouts database
CREATE DATABASE IF NOT EXISTS workouts
    CHARACTER SET utf8
    COLLATE utf8_general_ci;

# Create workouts table in the workouts database
CREATE TABLE IF NOT EXISTS workouts.workouts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE KEY,
    squats INT UNSIGNED,
    bench_press INT UNSIGNED,
    barbell_rows INT UNSIGNED,
    overhead_press INT UNSIGNED,
    deadlifts INT UNSIGNED);

# Grant all privileges to the workouts database to the workout tracker app
GRANT ALL ON workouts.* to 'workout_tracker'@'localhost';
