const companyService = require("../services/companyService");

const createProfile = async (req, res) => {
    try {
        const {
            company_name,   // frontend sends snake_case
            companyName,    // accept camelCase too
            description,
            phone,
            location,
            website
        } = req.body;

        const name = company_name ?? companyName;

        if (!name) {
            return res.status(400).json({
                message: "Company name is required"
            });
        }

        const company = await companyService.createProfile(
            req.user.id,
            name,
            description,
            phone,
            location,
            website
        );

        res.status(201).json({
            message: "Company profile created successfully",
            company
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const company =
            await companyService.getProfile(req.user.id);

        res.status(200).json({ company });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const {
            company_name,
            companyName,
            description,
            phone,
            location,
            website
        } = req.body;

        const name = company_name ?? companyName;

        const company = await companyService.updateProfile(
            req.user.id,
            name,
            description,
            phone,
            location,
            website
        );

        res.status(200).json({
            message: "Company profile updated successfully",
            company
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createProfile,
    getProfile,
    updateProfile
};
