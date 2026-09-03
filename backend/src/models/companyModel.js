const db = require("../config/database");

const createCompanyProfile = async (
    userId,
    companyName,
    description,
    phone,
    location,
    website
) => {
    const [result] = await db.execute(
        `INSERT INTO companies
        (user_id, company_name, description, phone, location, website)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            userId,
            companyName,
            description,
            phone,
            location,
            website
        ]
    );

    return result;
};

const findCompanyByUserId = async (userId) => {
    const [rows] = await db.execute(
        `SELECT *
         FROM companies
         WHERE user_id = ?`,
        [userId]
    );

    return rows[0];
};

const findCompanyById = async (companyId) => {
    const [rows] = await db.execute(
        `SELECT *
         FROM companies
         WHERE id = ?`,
        [companyId]
    );

    return rows[0];
};

const updateCompanyProfile = async (
    userId,
    companyName,
    description,
    phone,
    location,
    website
) => {
    const [result] = await db.execute(
        `UPDATE companies
         SET
            company_name = ?,
            description  = ?,
            phone        = ?,
            location     = ?,
            website      = ?
         WHERE user_id = ?`,
        [companyName, description, phone, location, website, userId]
    );

    return result;
};

const getAllCompanies = async () => {
    const [rows] = await db.execute(
        `SELECT
            companies.*,
            users.name,
            users.email,
            users.created_at AS registered_at
         FROM companies
         INNER JOIN users
            ON companies.user_id = users.id
         ORDER BY companies.id DESC`
    );

    return rows;
};

const verifyCompany = async (companyId, isVerified) => {
    const [result] = await db.execute(
        `UPDATE companies
         SET is_verified = ?
         WHERE id = ?`,
        [isVerified, companyId]
    );

    return result;
};

module.exports = {
    createCompanyProfile,
    updateCompanyProfile,
    findCompanyByUserId,
    findCompanyById,
    getAllCompanies,
    verifyCompany
};
