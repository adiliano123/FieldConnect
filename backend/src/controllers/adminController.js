const adminService = require("../services/adminService");

const getStudents = async (req, res) => {
    try {
        const students = await adminService.getAllStudents();

        res.status(200).json({
            message: "Students retrieved successfully",
            students
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCompanies = async (req, res) => {
    try {
        const companies = await adminService.getAllCompanies();

        res.status(200).json({
            message: "Companies retrieved successfully",
            companies
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOpportunities = async (req, res) => {
    try {
        const opportunities = await adminService.getAllOpportunities();

        res.status(200).json({
            message: "Opportunities retrieved successfully",
            opportunities
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getApplications = async (req, res) => {
    try {
        const applications = await adminService.getAllApplications();

        res.status(200).json({
            message: "Applications retrieved successfully",
            applications
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_verified } = req.body;

        if (is_verified === undefined) {
            return res.status(400).json({
                message: "is_verified field is required"
            });
        }

        const result = await adminService.verifyCompany(
            Number(id),
            Number(is_verified)
        );

        res.status(200).json({
            message: `Company ${Number(is_verified) === 1 ? "verified" : "unverified"} successfully`,
            company: result
        });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteOpportunity = async (req, res) => {
    try {
        const { id } = req.params;

        await adminService.deleteOpportunity(Number(id));

        res.status(200).json({
            message: "Opportunity deleted successfully"
        });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getStudents,
    getCompanies,
    getOpportunities,
    getApplications,
    verifyCompany,
    deleteOpportunity
};
