const db = require("../config/database");

const createNotification = async (
    userId,
    title,
    message,
    type
) => {
    const [result] = await db.execute(
        `INSERT INTO notifications
        (
            user_id,
            title,
            message,
            type
        )
        VALUES (?, ?, ?, ?)`,
        [
            userId,
            title,
            message,
            type
        ]
    );

    return result;
};

const getUserNotifications = async (userId) => {
    const [rows] = await db.execute(
        `SELECT *
         FROM notifications
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    return rows;
};

const markAsRead = async (
    notificationId,
    userId
) => {
    const [result] = await db.execute(
        `UPDATE notifications
         SET is_read = true
         WHERE id = ?
         AND user_id = ?`,
        [
            notificationId,
            userId
        ]
    );

    return result;
};

const markAllAsRead = async (userId) => {
    const [result] = await db.execute(
        `UPDATE notifications
         SET is_read = true
         WHERE user_id = ?`,
        [userId]
    );

    return result;
};

const getUnreadCount = async (userId) => {
    const [rows] = await db.execute(
        `SELECT COUNT(*) AS count
         FROM notifications
         WHERE user_id = ?
         AND is_read = false`,
        [userId]
    );

    return rows[0].count;
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
};