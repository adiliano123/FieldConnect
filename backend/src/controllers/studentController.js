const studentService = require("../services/studentService");

const createProfile = async (req, res) => {
    try {
        const {
            university,
            course,
            year_of_study,   // frontend sends snake_case
            yearOfStudy,     // accept camelCase too
            phone,
            location,
            bio
        } = req.body;

        if (!university || !course) {
            return res.status(400).json({
                message: "University and course are required"
            });
        }

        const student = await studentService.createProfile(
            req.user.id,
            university,
            course,
            year_of_study ?? yearOfStudy,
            phone,
            location,
            bio
        );

        res.status(201).json({
            message: "Student profile created successfully",
            student
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const student =
            await studentService.getProfile(req.user.id);

        res.status(200).json({ student });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const {
            university,
            course,
            year_of_study,
            yearOfStudy,
            phone,
            location,
            bio
        } = req.body;

        const student = await studentService.updateProfile(
            req.user.id,
            university,
            course,
            year_of_study ?? yearOfStudy,
            phone,
            location,
            bio
        );

        res.status(200).json({
            message: "Student profile updated successfully",
            student
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    createProfile,
    getProfile,
    updateProfile
};
