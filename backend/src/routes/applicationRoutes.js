const express = require("express");

const applicationController = require("../controllers/applicationController");
const authMiddleware         = require("../middleware/authMiddleware");
const roleMiddleware         = require("../middleware/roleMiddleware");

const router = express.Router();

// ── Student: submit application ───────────────────
router.post(
    "/",
    authMiddleware,
    roleMiddleware("student"),
    applicationController.apply
);

// ── Student: view own applications ───────────────
// Both paths point to the same handler
router.get(
    "/my-applications",
    authMiddleware,
    roleMiddleware("student"),
    applicationController.getMyApplications
);

router.get(
    "/my",
    authMiddleware,
    roleMiddleware("student"),
    applicationController.getMyApplications
);

// ── Company: view all applications for its opps ──
router.get(
    "/company",
    authMiddleware,
    roleMiddleware("company"),
    applicationController.getCompanyApplications
);

// ── Company: view applications for one opportunity
router.get(
    "/opportunity/:opportunityId",
    authMiddleware,
    roleMiddleware("company"),
    applicationController.getOpportunityApplications
);

// ── Company: accept / reject / review ────────────
router.put(
    "/:id/status",
    authMiddleware,
    roleMiddleware("company"),
    applicationController.updateApplicationStatus
);

module.exports = router;
