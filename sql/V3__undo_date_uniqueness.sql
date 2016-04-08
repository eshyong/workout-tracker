# Workout dates should not be unique *globally* across users
ALTER TABLE workouts
    MODIFY COLUMN date DATE NOT NULL,
    DROP INDEX date;
