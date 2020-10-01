DROP TABLE IF EXISTS chat;

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    text VARCHAR(955),
    sender_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT into chat
    (text, sender_id)
    VALUES ('Looking for a second hand Lenovo', 34), ('I know a good website for this', 84), ('Go to Sonnenallee', 98),('They are open trotz Corona', 98), ('My aount has one lemme check', 76), ('Otherwhise we will go camping', 57), ('Brilliant!', 98), ('Yeah lets get a life!', 57), ('Go to Liepnizsee its so pretty', 98),('Without laptop!?', 34);

    SELECT * FROM chat;