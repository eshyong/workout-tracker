# Create users table in workouts database
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE KEY,
    password_hash VARCHAR(255) NOT NULL);

# Create workouts table in workouts database
# A workout can be of type A or B, and is represented by the boolean
# field `is_type_a`
CREATE TABLE IF NOT EXISTS workouts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    is_type_a BOOLEAN NOT NULL,
    date DATE NOT NULL UNIQUE KEY,
    squats INT UNSIGNED,
    bench_press INT UNSIGNED,
    barbell_rows INT UNSIGNED,
    overhead_press INT UNSIGNED,
    deadlifts INT UNSIGNED,
    user_id INT UNSIGNED NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id));
