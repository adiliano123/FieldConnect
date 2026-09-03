const db = require("../config/database");

const createPayment = async (
    applicationId,
    studentId,
    opportunityId,
    amount,
    opportunityType,
    txRef
) => {
    const [result] = await db.execute(
        `INSERT INTO payments
         (application_id, student_id, opportunity_id, amount, opportunity_type, tx_ref)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [applicationId, studentId, opportunityId, amount, opportunityType, txRef]
    );
    return result;
};

const findPaymentByTxRef = async (txRef) => {
    const [rows] = await db.execute(
        `SELECT * FROM payments WHERE tx_ref = ?`,
        [txRef]
    );
    return rows[0];
};

const findPaymentByApplicationId = async (applicationId) => {
    const [rows] = await db.execute(
        `SELECT * FROM payments WHERE application_id = ? ORDER BY created_at DESC LIMIT 1`,
        [applicationId]
    );
    return rows[0];
};

const updatePaymentStatus = async (txRef, status, flwTxId, flwTxRef, paymentMethod) => {
    const [result] = await db.execute(
        `UPDATE payments
         SET status = ?, flw_tx_id = ?, flw_tx_ref = ?, payment_method = ?
         WHERE tx_ref = ?`,
        [status, flwTxId, flwTxRef, paymentMethod, txRef]
    );
    return result;
};

const getAllPayments = async () => {
    const [rows] = await db.execute(
        `SELECT
            payments.*,
            users.name        AS student_name,
            users.email       AS student_email,
            opportunities.title AS opportunity_title,
            companies.company_name
         FROM payments
         INNER JOIN students     ON payments.student_id     = students.id
         INNER JOIN users        ON students.user_id        = users.id
         INNER JOIN opportunities ON payments.opportunity_id = opportunities.id
         INNER JOIN companies    ON opportunities.company_id = companies.id
         ORDER BY payments.created_at DESC`
    );
    return rows;
};

const getPaymentsByStudent = async (studentId) => {
    const [rows] = await db.execute(
        `SELECT
            payments.*,
            opportunities.title AS opportunity_title,
            companies.company_name
         FROM payments
         INNER JOIN opportunities ON payments.opportunity_id = opportunities.id
         INNER JOIN companies     ON opportunities.company_id = companies.id
         WHERE payments.student_id = ?
         ORDER BY payments.created_at DESC`,
        [studentId]
    );
    return rows;
};

module.exports = {
    createPayment,
    findPaymentByTxRef,
    findPaymentByApplicationId,
    updatePaymentStatus,
    getAllPayments,
    getPaymentsByStudent
};
