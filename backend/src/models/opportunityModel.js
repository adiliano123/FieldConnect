const db = require("../config/database");

const createOpportunity = async (
    companyId,
    title,
    description,
    type,
    category,
    location,
    requirements,
    positions,
    deadline
) => {
    const [result] = await db.execute(
        `INSERT INTO opportunities
        (
            company_id,
            title,
            description,
            type,
            category,
            location,
            requirements,
            positions,
            deadline
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            companyId,
            title,
            description,
            type,
            category,
            location,
            requirements,
            positions,
            deadline
        ]
    );

    return result;
};

const getAllOpportunities = async () => {
    const [rows] = await db.execute(
        `SELECT
            opportunities.*,
            companies.company_name
         FROM opportunities
         INNER JOIN companies
            ON opportunities.company_id = companies.id
         WHERE opportunities.status = 'open'
         ORDER BY opportunities.created_at DESC`
    );

    return rows;
};

const getOpportunityById = async (id) => {
    const [rows] = await db.execute(
        `SELECT
            opportunities.*,
            companies.company_name,
            companies.location AS company_location
         FROM opportunities
         INNER JOIN companies
            ON opportunities.company_id = companies.id
         WHERE opportunities.id = ?`,
        [id]
    );

    return rows[0];
};

const getOpportunitiesByCompany = async (companyId) => {
    const [rows] = await db.execute(
        `SELECT *
         FROM opportunities
         WHERE company_id = ?
         ORDER BY created_at DESC`,
        [companyId]
    );

    return rows;
};

const updateOpportunity = async (
    id,
    companyId,
    title,
    description,
    type,
    category,
    location,
    requirements,
    positions,
    deadline,
    status
) => {
    const [result] = await db.execute(
        `UPDATE opportunities
         SET
            title = ?,
            description = ?,
            type = ?,
            category = ?,
            location = ?,
            requirements = ?,
            positions = ?,
            deadline = ?,
            status = ?
         WHERE id = ?
         AND company_id = ?`,
        [
            title,
            description,
            type,
            category,
            location,
            requirements,
            positions,
            deadline,
            status,
            id,
            companyId
        ]
    );

    return result;
};

const deleteOpportunity = async (id, companyId) => {
    const [result] = await db.execute(
        `DELETE FROM opportunities
         WHERE id = ?
         AND company_id = ?`,
        [id, companyId]
    );

    return result;
};

const getAllOpportunitiesAdmin = async () => {
    const [rows] = await db.execute(
        `SELECT
            opportunities.*,
            companies.company_name
         FROM opportunities
         INNER JOIN companies
            ON opportunities.company_id = companies.id
         ORDER BY opportunities.created_at DESC`
    );

    return rows;
};

const deleteOpportunityAdmin = async (id) => {
    const [result] = await db.execute(
        `DELETE FROM opportunities WHERE id = ?`,
        [id]
    );

    return result;
};

module.exports = {
    createOpportunity,
    getAllOpportunities,
    getAllOpportunitiesAdmin,
    getOpportunityById,
    getOpportunitiesByCompany,
    updateOpportunity,
    deleteOpportunity,
    deleteOpportunityAdmin
};