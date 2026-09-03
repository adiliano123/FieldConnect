const authService   = require("../services/authService");
const emailService  = require("../services/emailService");
const adminNotif    = require("../services/adminNotificationService");

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const userRole = role || "student";

        const user = await authService.registerUser(
            name,
            email,
            password,
            userRole
        );

        // Welcome email (non-blocking)
        emailService.sendWelcomeEmail({ name, email, role: userRole }).catch(() => {});

        // Notify admin (non-blocking)
        adminNotif.onUserRegistered(name, email, userRole).catch(() => {});
        if (userRole === "company") {
            adminNotif.onCompanyNeedsVerification(name).catch(() => {});
        }

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await authService.loginUser(
            email,
            password
        );

        res.status(200).json({
            message: "Login successful",
            ...result
        });

    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};

module.exports = {
    register,
    login
};