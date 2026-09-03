const applicationService =
    require("../services/applicationService");


const apply = async (req, res) => {
    try {

        const {
            opportunityId,
            coverLetter
        } = req.body;

        if (!opportunityId) {
            return res.status(400).json({
                message:
                    "Opportunity ID is required"
            });
        }

        const application =
            await applicationService.createApplication(
                req.user.id,
                opportunityId,
                coverLetter
            );

        res.status(201).json({
            message:
                "Application submitted successfully",
            application
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


const getMyApplications = async (req, res) => {
    try {

        const applications =
            await applicationService
                .getMyApplications(
                    req.user.id
                );

        res.status(200).json({
            applications
        });

    } catch (error) {

        res.status(404).json({
            message: error.message
        });
    }
};


const getCompanyApplications = async (req, res) => {
    try {
        const applications =
            await applicationService.getCompanyApplications(
                req.user.id
            );

        res.status(200).json({ applications });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getOpportunityApplications =
    async (req, res) => {

        try {

            const applications =
                await applicationService
                    .getOpportunityApplications(
                        req.user.id,
                        req.params.opportunityId
                    );

            res.status(200).json({
                applications
            });

        } catch (error) {

            res.status(403).json({
                message: error.message
            });
        }
    };


const updateApplicationStatus =
    async (req, res) => {

        try {

            const {
                status
            } = req.body;

            const result =
                await applicationService
                    .updateApplicationStatus(
                        req.user.id,
                        req.params.id,
                        status
                    );

            res.status(200).json(result);

        } catch (error) {

            res.status(400).json({
                message: error.message
            });
        }
    };


module.exports = {
    apply,
    getMyApplications,
    getCompanyApplications,
    getOpportunityApplications,
    updateApplicationStatus
};