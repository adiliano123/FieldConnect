const express        = require("express");
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Public
router.get("/fees",    paymentController.getFees);
router.post("/webhook", paymentController.webhook);

// Student
router.post("/initialize",                    authMiddleware, roleMiddleware("student"), paymentController.initializePayment);
router.post("/verify",                        authMiddleware, roleMiddleware("student"), paymentController.verifyPayment);
router.get("/my",                             authMiddleware, roleMiddleware("student"), paymentController.getMyPayments);
router.get("/application/:applicationId",     authMiddleware, roleMiddleware("student"), paymentController.getPaymentByApplication);

// Admin
router.get("/",  authMiddleware, roleMiddleware("admin"), paymentController.getAllPayments);

module.exports = router;
