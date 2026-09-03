const db = require("../config/database");

const create = async (title, message, type = "system", link = null) => {
    const [result] = await db.execute(
        `INSERT INTO admin_notifications (title, message, type, link)
         VALUES (?, ?, ?, ?)`,
        [title, message, type, link]
    );
    return result;
};

const getAll = async () => {
    const [rows] = await db.execute(
        `SELECT * FROM admin_notifications ORDER BY created_at DESC`
    );
    return rows;
};

const getUnreadCount = async () => {
    const [rows] = await db.execute(
        `SELECT COUNT(*) AS count FROM admin_notifications WHERE is_read = 0`
    );
    return rows[0].count;
};

const markAsRead = async (id) => {
    await db.execute(
        `UPDATE admin_notifications SET is_read = 1 WHERE id = ?`,
        [id]
    );
};

const markAllAsRead = async () => {
    await db.execute(
        `UPDATE admin_notifications SET is_read = 1 WHERE is_read = 0`
    );
};

module.exports = { create, getAll, getUnreadCount, markAsRead, markAllAsRead };
