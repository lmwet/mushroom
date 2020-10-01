const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres:@localhost@localhost:5432/forum"
);

//  POST to /register
exports.addUser = (first, last, email, password) => {
    const q = `INSERT into users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
    const params = [first, last, email, password];
    return db.query(q, params);
};

//Post to /login and to /pw/reset/start
exports.getUser = (email) => {
    const q = `SELECT  
    users.first,
    users.last,
    users.id,
    users.url,
    users.password,
    users.bio
    FROM users 
    WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

exports.storeCode = (secretCode, email) => {
    const q = `INSERT into password_reset_codes (code, email)
    VALUES ($1, $2)
    RETURNING *`;

    const params = [secretCode, email];
    return db.query(q, params);
};

exports.findCode = (code, email) => {
    const q = `SELECT * FROM password_reset_codes
    WHERE code = $1 AND email = $2 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`;
    const params = [code, email];
    return db.query(q, params);
};

exports.replacePw = (email, newPw) => {
    const q = `UPDATE users
    SET password = $2
    WHERE email = $1
    RETURNING *`;
    const params = [email, newPw];
    return db.query(q, params);
};

exports.setImage = (imageUrl, email) => {
    const q = `UPDATE users
    SET url = $1
    WHERE email = $2
    RETURNING *`;
    const params = [imageUrl, email];
    return db.query(q, params);
};

exports.recordImage = (imageUrl, userId) => {
    const q = `INSERT into profile_pictures (url, user_id)
    VALUES ($1, $2)`;
    console.log(q);
    const params = [imageUrl, userId];
    return db.query(q, params);
};

exports.saveBio = (email, bio) => {
    const q = `UPDATE users 
            SET bio = $2
            WHERE email = $1
            RETURNING *`;
    const params = [email, bio];
    return db.query(q, params);
};

exports.getUserById = (id) => {
    const q = `SELECT  
    users.first,
    users.last,
    users.email,
    users.url,
    users.password,
    users.bio
    FROM users 
    WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

exports.getNewbies = () => {
    const q = `SELECT  *
    FROM users 
    ORDER BY created_at DESC
    LIMIT 3`;
    return db.query(q);
};

exports.searchUsers = (val) => {
    const q = `SELECT * 
    FROM users 
    WHERE first ILIKE $1
    ORDER BY first ASC`;
    const params = [val + "%"];
    return db.query(q, params);
};

exports.checkFriendship = (myId, otherId) => {
    const q = `SELECT * 
    FROM friendships 
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1);`;
    const params = [myId, otherId];
    return db.query(q, params);
};

exports.makeFriendsRequest = (myId, otherId) => {
    const q = `INSERT into friendships
    (sender_id, receiver_id)
    VALUES ($1, $2)
    RETURNING *`;
    const params = [myId, otherId];
    return db.query(q, params);
};

exports.cancelFriendsRequest = (myId, otherId) => {
    const q = `DELETE 
    FROM friendships
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)`;
    const params = [myId, otherId];
    return db.query(q, params);
};

exports.acceptFriendsRequest = (myId, otherId) => {
    const q = `UPDATE friendships
    SET accepted = true
    WHERE (receiver_id = $1 AND sender_id = $2)`;
    const params = [myId, otherId];
    return db.query(q, params);
};

exports.getFriends = (myId) => {
    const q = `SELECT users.id, first, last, url, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`;
    const params = [myId];
    return db.query(q, params);
};

exports.getTenMessages = () => {
    const q = `SELECT users.id, users.first, users.last, users.url, chat.text, chat.sender_id, chat.created_at
    FROM chat
    JOIN users
    ON chat.sender_id = users.id
    ORDER BY created_at DESC
    LIMIT 10`;
    return db.query(q);
};

exports.postMessage = (newMsg, userId) => {
    const q = `INSERT into chat
    (text, sender_id)
    VALUES ($1, $2)
    RETURNING *`;
    const params = [newMsg, userId];
    return db.query(q, params);
};

exports.getMessage = (userId) => {
    const q = `SELECT users.id, users.first, users.last, users.url, chat.id, chat.text, chat.sender_id, chat.created_at
    FROM chat
    JOIN users
    ON chat.sender_id = users.id
    WHERE chat.sender_id = $1
    ORDER BY created_at DESC
    LIMIT 1`;
    const params = [userId];
    return db.query(q, params);
};

exports.deleteUserData = (id) => {
    const q = `DELETE
    FROM users
    WHERE users.id = $1`;
    const params = [id];
    return db.query(q, params);
};

exports.deleteUserFriendships = (id) => {
    const q = `DELETE
    FROM friendships
    WHERE (sender_id = $1) OR (receiver_id = $1)`;
    const params = [id];
    return db.query(q, params);
};

exports.deleteUserMessages = (id) => {
    const q = `DELETE
    FROM chat
    WHERE sender_id = $1`;
    const params = [id];
    return db.query(q, params);
};

exports.getPicturesById = (id) => {
    const q = `SELECT *
    FROM profile_pictures
    WHERE user_id = $1`;
    const params = [id];
    return db.query(q, params);
};

exports.deleteImages = (id) => {
    const q = `DELETE
    FROM profile_pictures
    WHERE user_id = $1`;
    console.log(q);
    const params = [id];
    return db.query(q, params);
};

exports.getTenWallMessages = () => {
    const q = `SELECT users.id, users.first, users.last, users.url, wall_messages.text, wall_messages.sender_id, wall_messages.created_at
    FROM wall_messages
    JOIN users
    ON wall_messages.sender_id = users.id
    ORDER BY created_at DESC
    LIMIT 10`;
    return db.query(q);
};

exports.postWallMessage = (newMsg, userId) => {
    const q = `INSERT into wall_messages
    (text, sender_id)
    VALUES ($1, $2)
    RETURNING *`;
    const params = [newMsg, userId];
    return db.query(q, params);
};

exports.getWallMessage = (userId) => {
    const q = `SELECT users.id, users.first, users.last, users.url, wall_messages.id, wall_messages.text, wall_messages.sender_id, wall_messages.created_at
    FROM wall_messages
    JOIN users
    ON wall_messages.sender_id = users.id
    WHERE wall_messages.sender_id = $1
    ORDER BY created_at DESC
    LIMIT 1`;
    const params = [userId];
    return db.query(q, params);
};
