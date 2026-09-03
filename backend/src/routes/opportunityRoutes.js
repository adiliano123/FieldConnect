const express = require("express");

const opportunityController = require("../controllers/opportunityController");
const authMiddleware        = require("../middleware/authMiddleware");
const roleMiddleware        = require("../middleware/roleMiddleware");

const router = express.Router();

// ── Public ────────────────────────────────────────
router.get("/", opportunityController.getAllOpportunities);

// ── Company — specific string routes BEFORE /:id ─
router.get(
    "/company",
    authMiddleware,
    roleMiddleware("company"),
    opportunityController.getMyOpportunities
);

router.get(
    "/company/my-opportunities",
    authMiddleware,
    roleMiddleware("company"),
    opportunityController.getMyOpportunities
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("company"),
    opportunityController.createOpportunity
);

// ── Parameterised routes (must come last) ─────────
router.get("/:id", opportunityController.getOpportunityById);

router.put(
    "/:id/close",
    authMiddleware,
    roleMiddleware("company"),
    opportunityController.closeOpportunity
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("company"),
    opportunityController.updateOpportunity
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("company"),
    opportunityController.deleteOpportunity
);

module.exports = router;
