const notificationModel =
    require("../models/notificationModel");

const createNotification = async (
    userId,
    title,
    message,
    type
) => {
    const result =
        await notificationModel.createNotification(
            userId,
            title,
            message,
            type
        );

    return {
        id: result.insertId,
        userId,
        title,
        message,
        type,
        isRead: false
    };
};

const getMyNotifications = async (userId) => {
    return await notificationModel
        .getUserNotifications(userId);
};

const markAsRead = async (
    notificationId,
    userId
) => {
    const result =
        await notificationModel.markAsRead(
            notificationId,
            userId
        );

    if (result.affectedRows === 0) {
        throw new Error(
            "Notification not found"
        );
    }

    return {
        message: "Notification marked as read"
    };
};

const markAllAsRead = async (userId) => {
    await notificationModel.markAllAsRead(
        userId
    );

    return {
        message:
            "All notifications marked as read"
    };
};

const getUnreadCount = async (userId) => {
    return await notificationModel
        .getUnreadCount(userId);
};

module.exports = {
    createNotification,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
};