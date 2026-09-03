const db = require("../config/database");


const createApplication = async (
    studentId,
    opportunityId,
    coverLetter
) => {
    const [result] = await db.execute(
        `INSERT INTO applications
        (
            student_id,
            opportunity_id,
            cover_letter
        )
        VALUES (?, ?, ?)`,
        [
            studentId,
            opportunityId,
            coverLetter
        ]
    );

    return result;
};



const findApplication = async (
    studentId,
    opportunityId
) => {
    const [rows] = await db.execute(
        `SELECT *
         FROM applications
         WHERE student_id = ?
         AND opportunity_id = ?`,
        [
            studentId,
            opportunityId
        ]
    );

    return rows[0];
};


const getApplicationById = async (id) => {
    const [rows] = await db.execute(
        `SELECT
            applications.*,
            students.user_id AS student_user_id
         FROM applications
         INNER JOIN students
            ON applications.student_id = students.id
         WHERE applications.id = ?`,
        [id]
    );
    return rows[0];
};

const getApplicationWithStudentById = async (id) => {
    const [rows] = await db.execute(
        `SELECT
            applications.*,
            students.user_id   AS student_user_id,
            users.name         AS student_name,
            users.email        AS student_email,
            opportunities.title        AS opportunity_title,
            opportunities.type         AS opportunity_type,
            companies.company_name
         FROM applications
         INNER JOIN students      ON applications.student_id     = students.id
         INNER JOIN users         ON students.user_id            = users.id
         INNER JOIN opportunities ON applications.opportunity_id = opportunities.id
         INNER JOIN companies     ON opportunities.company_id    = companies.id
         WHERE applications.id = ?`,
        [id]
    );
    return rows[0];
};




const getApplicationsByStudent = async (
    studentId
) => {
    const [rows] = await db.execute(
        `SELECT
            applications.*,
            opportunities.title,
            opportunities.type,
            opportunities.category,
            opportunities.location,
            opportunities.deadline,
            companies.company_name

         FROM applications

         INNER JOIN opportunities
            ON applications.opportunity_id =
               opportunities.id

         INNER JOIN companies
            ON opportunities.company_id =
               companies.id

         WHERE applications.student_id = ?

         ORDER BY applications.applied_at DESC`,
        [studentId]
    );

    return rows;
};



const getApplicationsByOpportunity = async (
    opportunityId
) => {
    const [rows] = await db.execute(
        `SELECT
            applications.*,

            students.university,
            students.course,
            students.year_of_study,
            students.phone,
            students.location,
            students.bio,

            users.name,
            users.email

         FROM applications

         INNER JOIN students
            ON applications.student_id =
               students.id

         INNER JOIN users
            ON students.user_id =
               users.id

         WHERE applications.opportunity_id = ?

         ORDER BY applications.applied_at DESC`,
        [opportunityId]
    );

    return rows;
};

 

const updateApplicationStatus = async (
    applicationId,
    status
) => {
    const [result] = await db.execute(
        `UPDATE applications
         SET status = ?
         WHERE id = ?`,
        [
            status,
            applicationId
        ]
    );

    return result;
};


const getApplicationsByCompany = async (companyId) => {
    const [rows] = await db.execute(
        `SELECT
            applications.*,
            users.name  AS student_name,
            users.email AS student_email,
            students.university,
            students.course,
            opportunities.title     AS opportunity_title,
            opportunities.type,
            opportunities.location
         FROM applications
         INNER JOIN students
            ON applications.student_id = students.id
         INNER JOIN users
            ON students.user_id = users.id
         INNER JOIN opportunities
            ON applications.opportunity_id = opportunities.id
         WHERE opportunities.company_id = ?
         ORDER BY applications.applied_at DESC`,
        [companyId]
    );

    return rows;
};

const getAllApplications = async () => {
    const [rows] = await db.execute(
        `SELECT
            applications.*,
            users.name  AS student_name,
            users.email AS student_email,
            opportunities.title AS opportunity_title,
            opportunities.type,
            opportunities.location,
            companies.company_name
         FROM applications
         INNER JOIN students
            ON applications.student_id = students.id
         INNER JOIN users
            ON students.user_id = users.id
         INNER JOIN opportunities
            ON applications.opportunity_id = opportunities.id
         INNER JOIN companies
            ON opportunities.company_id = companies.id
         ORDER BY applications.applied_at DESC`
    );

    return rows;
};

module.exports = {
    createApplication,
    findApplication,
    getApplicationById,
    getApplicationWithStudentById,
    getApplicationsByStudent,
    getApplicationsByCompany,
    getApplicationsByOpportunity,
    updateApplicationStatus,
    getAllApplications
};