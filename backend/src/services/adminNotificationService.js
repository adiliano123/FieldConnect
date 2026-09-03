const adminNotif = require("../models/adminNotificationModel");

const notify = async (title, message, type = "system", link = null) => {
    try {
        await adminNotif.create(title, message, type, link);
    } catch (err) {
        console.error("[AdminNotif error]", err.message);
    }
};

// Called when a new user registers
const onUserRegistered = (name, email, role) => {
    const icon = role === "company" ? "🏢" : "🎓";
    return notify(
        `${icon} New ${role} registered`,
        `${name} (${email}) just created a ${role} account.`,
        role === "company" ? "company" : "student",
        role === "company" ? "/admin/companies" : "/admin/students"
    );
};

// Called when a company posts an opportunity
const onOpportunityPosted = (title, companyName) => {
    return notify(
        "📋 New opportunity posted",
        `"${title}" was posted by ${companyName}.`,
        "opportunity",
        "/admin/opportunities"
    );
};

// Called when a student submits an application
const onApplicationSubmitted = (studentName, opportunityTitle) => {
    return notify(
        "📝 New application submitted",
        `${studentName} applied for "${opportunityTitle}".`,
        "application",
        "/admin/applications"
    );
};

// Called when a payment is completed
const onPaymentCompleted = (studentName, amount, opportunityTitle) => {
    return notify(
        "💰 Payment received",
        `${studentName} paid TZS ${Number(amount).toLocaleString()} for "${opportunityTitle}".`,
        "payment",
        "/admin/payments"
    );
};

// Called when a company registers (needs verification)
const onCompanyNeedsVerification = (companyName) => {
    return notify(
        "⚠️ Company awaiting verification",
        `${companyName} has registered and is waiting to be verified.`,
        "company",
        "/admin/companies"
    );
};

module.exports = {
    notify,
    onUserRegistered,
    onOpportunityPosted,
    onApplicationSubmitted,
    onPaymentCompleted,
    onCompanyNeedsVerification,
};
