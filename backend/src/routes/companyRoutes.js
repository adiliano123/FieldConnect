const express = require("express");

const companyController = require("../controllers/companyController");
const authMiddleware    = require("../middleware/authMiddleware");
const roleMiddleware    = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/profile", authMiddleware, roleMiddleware("company"), companyController.createProfile);
router.get("/profile",  authMiddleware, roleMiddleware("company"), companyController.getProfile);
router.put("/profile",  authMiddleware, roleMiddleware("company"), companyController.updateProfile);

module.exports = router;
