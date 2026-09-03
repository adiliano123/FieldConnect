const opportunityService = require("../services/opportunityService");
const adminNotif         = require("../services/adminNotificationService");

const createOpportunity = async (req, res) => {
    try {
        const {
            title,
            description,
            type,
            category,
            location,
            requirements,
            positions,
            deadline
        } = req.body;

        if (
            !title ||
            !description ||
            !type ||
            !category ||
            !location ||
            !deadline
        ) {
            return res.status(400).json({
                message:
                    "Title, description, type, category, location and deadline are required"
            });
        }

        const opportunity =
            await opportunityService.createOpportunity(
                req.user.id,
                title,
                description,
                type,
                category,
                location,
                requirements,
                positions || 1,
                deadline
            );

        res.status(201).json({
            message: "Opportunity created successfully",
            opportunity
        });

        // Notify admin (non-blocking)
        adminNotif.onOpportunityPosted(
            opportunity.title ?? req.body.title,
            opportunity.company_name ?? "A company"
        ).catch(() => {});

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const getAllOpportunities = async (req, res) => {
    try {
        const opportunities =
            await opportunityService.getAllOpportunities();

        res.status(200).json({
            opportunities
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getOpportunityById = async (req, res) => {
    try {
        const opportunity =
            await opportunityService.getOpportunityById(
                req.params.id
            );

        res.status(200).json({
            opportunity
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

const getMyOpportunities = async (req, res) => {
    try {
        const opportunities =
            await opportunityService.getMyOpportunities(
                req.user.id
            );

        res.status(200).json({
            opportunities
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

const updateOpportunity = async (req, res) => {
    try {
        const {
            title,
            description,
            type,
            category,
            location,
            requirements,
            positions,
            deadline,
            status
        } = req.body;

        const result =
            await opportunityService.updateOpportunity(
                req.user.id,
                req.params.id,
                title,
                description,
                type,
                category,
                location,
                requirements,
                positions,
                deadline,
                status
            );

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const deleteOpportunity = async (req, res) => {
    try {
        const result =
            await opportunityService.deleteOpportunity(
                req.user.id,
                req.params.id
            );

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const closeOpportunity = async (req, res) => {
    try {
        const result =
            await opportunityService.updateOpportunity(
                req.user.id,
                req.params.id,
                undefined, undefined, undefined,
                undefined, undefined, undefined,
                undefined, undefined,
                "closed"
            );
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createOpportunity,
    getAllOpportunities,
    getOpportunityById,
    getMyOpportunities,
    updateOpportunity,
    closeOpportunity,
    deleteOpportunity
};