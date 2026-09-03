const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

// All admin routes require a valid JWT + admin role
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// ── Read endpoints ────────────────────────────────
router.get("/students",      adminController.getStudents);
router.get("/companies",     adminController.getCompanies);
router.get("/opportunities", adminController.getOpportunities);
router.get("/applications",  adminController.getApplications);

// ── Admin notifications ───────────────────────────
router.get("/notifications", async (req, res) => {
    const m = require("../models/adminNotificationModel");
    const notifications = await m.getAll();
    res.json({ notifications });
});
router.get("/notifications/unread-count", async (req, res) => {
    const m = require("../models/adminNotificationModel");
    const count = await m.getUnreadCount();
    res.json({ count });
});
router.put("/notifications/read-all", async (req, res) => {
    const m = require("../models/adminNotificationModel");
    await m.markAllAsRead();
    res.json({ message: "All marked as read" });
});
router.put("/notifications/:id/read", async (req, res) => {
    const m = require("../models/adminNotificationModel");
    await m.markAsRead(Number(req.params.id));
    res.json({ message: "Marked as read" });
});
router.get("/payments",      async (req, res) => {
    try {
        const paymentService = require("../services/paymentService");
        const payments = await paymentService.getAllPayments();
        res.status(200).json({ payments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── Mutating endpoints ────────────────────────────
router.put("/companies/:id/verify",      adminController.verifyCompany);
router.delete("/opportunities/:id",      adminController.deleteOpportunity);

module.exports = router;
