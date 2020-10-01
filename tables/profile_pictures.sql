DROP TABLE IF EXISTS profile_pictures;

CREATE TABLE profile_pictures (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255),
    user_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

  SELECT * FROM profile_pictures;

