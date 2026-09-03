const notificationService =
    require("../services/notificationService");

const getMyNotifications = async (
    req,
    res
) => {
    try {
        const notifications =
            await notificationService
                .getMyNotifications(
                    req.user.id
                );

        res.status(200).json({
            notifications
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const markAsRead = async (
    req,
    res
) => {
    try {
        const result =
            await notificationService.markAsRead(
                req.params.id,
                req.user.id
            );

        res.status(200).json(result);

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

const markAllAsRead = async (
    req,
    res
) => {
    try {
        const result =
            await notificationService
                .markAllAsRead(
                    req.user.id
                );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getUnreadCount = async (
    req,
    res
) => {
    try {
        const count =
            await notificationService
                .getUnreadCount(
                    req.user.id
                );

        res.status(200).json({
            unreadCount: count
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
};