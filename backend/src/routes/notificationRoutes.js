const express = require("express");

const notificationController = require("../controllers/notificationController");
const authMiddleware         = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/",           authMiddleware, notificationController.getMyNotifications);
router.get("/unread-count", authMiddleware, notificationController.getUnreadCount);

// IMPORTANT: specific routes must come before parameterised ones
router.put("/read-all",   authMiddleware, notificationController.markAllAsRead);
router.put("/:id/read",   authMiddleware, notificationController.markAsRead);

module.exports = router;
