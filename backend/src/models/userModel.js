const db = require("../config/database");

const createUser = async (name, email, password, role) => {
    const [result] = await db.execute(
        `INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, ?)`,
        [name, email, password, role]
    );

    return result;
};

const findUserByEmail = async (email) => {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );

    return rows[0];
};

const findUserById = async (id) => {
    const [rows] = await db.execute(
        `SELECT id, name, email, role, created_at, updated_at
         FROM users
         WHERE id = ?`,
        [id]
    );

    return rows[0];
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};