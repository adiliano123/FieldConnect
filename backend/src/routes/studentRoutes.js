const express = require("express");

const studentController = require("../controllers/studentController");
const authMiddleware    = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/profile", authMiddleware, studentController.createProfile);
router.get("/profile",  authMiddleware, studentController.getProfile);
router.put("/profile",  authMiddleware, studentController.updateProfile);

module.exports = router;
