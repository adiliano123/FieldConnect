const Flutterwave  = require("flutterwave-node-v3");
const paymentModel = require("../models/paymentModel");
const studentModel = require("../models/studentModel");
const applicationModel = require("../models/applicationModel");
const opportunityModel = require("../models/opportunityModel");
const notificationService = require("./notificationService");
const emailService        = require("./emailService");
const adminNotif          = require("./adminNotificationService");

// Lazy-init Flutterwave so missing keys don't crash on startup
let _flw = null;
const getFlw = () => {
    if (!_flw) {
        _flw = new Flutterwave(
            process.env.FLW_PUBLIC_KEY,
            process.env.FLW_SECRET_KEY
        );
    }
    return _flw;
};

// Fee table (TZS)
const FEES = {
    field:      Number(process.env.FEE_FIELD)      || 10000,
    volunteer:  Number(process.env.FEE_VOLUNTEER)  || 10000,
    internship: Number(process.env.FEE_INTERNSHIP) || 25000,
    attachment: Number(process.env.FEE_ATTACHMENT) || 25000,
};

const getFeeForType = (type) => {
    return FEES[type?.toLowerCase()] ?? FEES.internship;
};

// Generate unique tx_ref
const generateTxRef = (studentId, applicationId) => {
    return `FC-${studentId}-${applicationId}-${Date.now()}`;
};

const initializePayment = async (userId, applicationId) => {
    // Load student
    const student = await studentModel.findStudentByUserId(userId);
    if (!student) throw new Error("Student profile not found");

    // Load application and verify it belongs to this student
    const application = await applicationModel.getApplicationById(applicationId);
    if (!application) throw new Error("Application not found");
    if (application.student_id !== student.id) throw new Error("Unauthorized");
    if (application.status !== "accepted") throw new Error("Payment is only required for accepted applications");

    // Check if already paid
    const existing = await paymentModel.findPaymentByApplicationId(applicationId);
    if (existing && existing.status === "completed") throw new Error("Payment already completed for this placement");

    // Load opportunity
    const opportunity = await opportunityModel.getOpportunityById(application.opportunity_id);
    if (!opportunity) throw new Error("Opportunity not found");

    const amount = getFeeForType(opportunity.type);
    const txRef  = generateTxRef(student.id, applicationId);

    // Persist pending payment record
    await paymentModel.createPayment(
        applicationId,
        student.id,
        opportunity.id,
        amount,
        opportunity.type,
        txRef
    );

    return {
        txRef,
        amount,
        currency: "TZS",
        opportunityType: opportunity.type,
        opportunityTitle: opportunity.title,
        companyName: opportunity.company_name,
    };
};

const verifyPayment = async (txRef, flwTransactionId) => {
    // Verify with Flutterwave
    const response = await getFlw().Transaction.verify({ id: flwTransactionId });

    if (
        response.status !== "success" ||
        response.data.status !== "successful" ||
        response.data.tx_ref !== txRef
    ) {
        await paymentModel.updatePaymentStatus(txRef, "failed", flwTransactionId, null, null);
        throw new Error("Payment verification failed");
    }

    const txData = response.data;

    // Update DB
    await paymentModel.updatePaymentStatus(
        txRef,
        "completed",
        String(txData.id),
        txData.flw_ref,
        txData.payment_type
    );

    // Notify student via in-app notification + email
    const payment = await paymentModel.findPaymentByTxRef(txRef);
    if (payment) {
        const app = await applicationModel.getApplicationWithStudentById(
            payment.application_id
        );
        if (app) {
            await notificationService.createNotification(
                app.student_user_id,
                "Payment Confirmed",
                `Your placement fee of TZS ${Number(payment.amount).toLocaleString()} has been received. Your placement is now confirmed.`,
                "system"
            );

            // Send receipt email
            emailService.sendPaymentConfirmed({
                studentName:      app.student_name  || "Student",
                studentEmail:     app.student_email || "",
                opportunityTitle: app.opportunity_title,
                companyName:      app.company_name,
                amount:           payment.amount,
                txRef:            payment.flw_tx_ref || txRef,
            }).catch(() => {});

            // Notify admin
            adminNotif.onPaymentCompleted(
                app.student_name || "A student",
                payment.amount,
                app.opportunity_title
            ).catch(() => {});
        }
    }

    return { message: "Payment verified and confirmed", txRef };
};

const getMyPayments = async (userId) => {
    const student = await studentModel.findStudentByUserId(userId);
    if (!student) throw new Error("Student profile not found");
    return await paymentModel.getPaymentsByStudent(student.id);
};

const getAllPayments = async () => {
    return await paymentModel.getAllPayments();
};

const getPaymentByApplication = async (userId, applicationId) => {
    const student = await studentModel.findStudentByUserId(userId);
    if (!student) throw new Error("Student profile not found");
    const payment = await paymentModel.findPaymentByApplicationId(applicationId);
    return payment ?? null;
};

module.exports = {
    getFeeForType,
    initializePayment,
    verifyPayment,
    getMyPayments,
    getAllPayments,
    getPaymentByApplication
};
