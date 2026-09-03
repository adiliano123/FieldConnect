const applicationModel =
    require("../models/applicationModel");

const studentModel =
    require("../models/studentModel");

const opportunityModel =
    require("../models/opportunityModel");

const companyModel =
    require("../models/companyModel");

const notificationService  = require("./notificationService");
const emailService         = require("./emailService");
const adminNotif           = require("./adminNotificationService");




const createApplication = async (
    userId,
    opportunityId,
    coverLetter
) => {

    const student =
        await studentModel.findStudentByUserId(userId);

    if (!student) {
        throw new Error(
            "Student profile not found"
        );
    }

    const opportunity =
        await opportunityModel.getOpportunityById(
            opportunityId
        );

    if (!opportunity) {
        throw new Error(
            "Opportunity not found"
        );
    }

    if (opportunity.status !== "open") {
        throw new Error(
            "This opportunity is no longer open"
        );
    }

    // Only check deadline if one is set
    if (opportunity.deadline) {
        const today    = new Date();
        today.setHours(0, 0, 0, 0);
        const deadline = new Date(opportunity.deadline);
        if (today > deadline) {
            throw new Error(
                "Application deadline has passed"
            );
        }
    }

    const existingApplication =
        await applicationModel.findApplication(
            student.id,
            opportunityId
        );

    if (existingApplication) {
        throw new Error(
            "You have already applied for this opportunity"
        );
    }

    const result =
        await applicationModel.createApplication(
            student.id,
            opportunityId,
            coverLetter
        );

    // Send confirmation email (non-blocking)
    const userModel = require("../models/userModel");
    const user = await userModel.findUserById(userId);
    emailService.sendApplicationSubmitted({
        studentName:      user?.name  || "Student",
        studentEmail:     user?.email || "",
        opportunityTitle: opportunity.title,
        companyName:      opportunity.company_name || "Organisation",
        type:             opportunity.type,
    }).catch(() => {});

    // Notify admin (non-blocking)
    adminNotif.onApplicationSubmitted(
        user?.name || "A student",
        opportunity.title
    ).catch(() => {});

    return {
        id: result.insertId,
        studentId: student.id,
        opportunityId,
        coverLetter,
        status: "pending"
    };
};




const getMyApplications = async (userId) => {

    const student =
        await studentModel.findStudentByUserId(userId);

    if (!student) {
        throw new Error(
            "Student profile not found"
        );
    }

    return await applicationModel
        .getApplicationsByStudent(student.id);
};



const getCompanyApplications = async (userId) => {

    const company =
        await companyModel.findCompanyByUserId(userId);

    if (!company) {
        throw new Error("Company profile not found");
    }

    return await applicationModel
        .getApplicationsByCompany(company.id);
};

const getOpportunityApplications = async (
    userId,
    opportunityId
) => {

    const company =
        await companyModel.findCompanyByUserId(userId);

    if (!company) {
        throw new Error(
            "Company profile not found"
        );
    }

    const opportunity =
        await opportunityModel.getOpportunityById(
            opportunityId
        );

    if (!opportunity) {
        throw new Error(
            "Opportunity not found"
        );
    }

    if (opportunity.company_id !== company.id) {
        throw new Error(
            "You do not own this opportunity"
        );
    }

    return await applicationModel
        .getApplicationsByOpportunity(
            opportunityId
        );
};



const updateApplicationStatus = async (
    userId,
    applicationId,
    status
) => {

    const allowedStatuses = [
        "reviewing",
        "accepted",
        "rejected"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new Error(
            "Invalid application status"
        );
    }

    const company =
        await companyModel.findCompanyByUserId(userId);

    if (!company) {
        throw new Error(
            "Company profile not found"
        );
    }

    const application =
        await applicationModel.getApplicationById(
            applicationId
        );

    if (!application) {
        throw new Error(
            "Application not found"
        );
    }

    const opportunity =
        await opportunityModel.getOpportunityById(
            application.opportunity_id
        );

    if (!opportunity) {
        throw new Error(
            "Opportunity not found"
        );
    }

    if (opportunity.company_id !== company.id) {
        throw new Error(
            "You do not own this opportunity"
        );
    }

    const result =
        await applicationModel.updateApplicationStatus(
            applicationId,
            status
        );

    if (result.affectedRows === 0) {
        throw new Error(
            "Unable to update application"
        );
    }

    // Fetch full application with student email
    const fullApp = await applicationModel
        .getApplicationWithStudentById(applicationId);

    let title;
    let message;

    if (status === "reviewing") {
        title   = "Application Under Review";
        message = `Your application for ${opportunity.title} is now being reviewed.`;

        emailService.sendApplicationReviewing({
            studentName:      fullApp?.student_name  || "Student",
            studentEmail:     fullApp?.student_email || "",
            opportunityTitle: opportunity.title,
            companyName:      opportunity.company_name,
        }).catch(() => {});

    } else if (status === "accepted") {
        title   = "Application Accepted";
        message = `Congratulations! Your application for ${opportunity.title} has been accepted. Please complete the placement fee payment.`;

        emailService.sendApplicationAccepted({
            studentName:      fullApp?.student_name  || "Student",
            studentEmail:     fullApp?.student_email || "",
            opportunityTitle: opportunity.title,
            companyName:      opportunity.company_name,
            type:             opportunity.type,
            applicationId:    applicationId,
        }).catch(() => {});

    } else {
        title   = "Application Rejected";
        message = `Your application for ${opportunity.title} has been rejected.`;

        emailService.sendApplicationRejected({
            studentName:      fullApp?.student_name  || "Student",
            studentEmail:     fullApp?.student_email || "",
            opportunityTitle: opportunity.title,
            companyName:      opportunity.company_name,
        }).catch(() => {});
    }

    await notificationService.createNotification(
        application.student_user_id,
        title,
        message,
        "application"
    );

    return {
        message: `Application ${status} successfully`
    };
};


module.exports = {
    createApplication,
    getMyApplications,
    getCompanyApplications,
    getOpportunityApplications,
    updateApplicationStatus
};