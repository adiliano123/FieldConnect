const db = require("../config/database");

const createStudentProfile = async (
    userId,
    university,
    course,
    yearOfStudy,
    phone,
    location,
    bio
) => {
    const [result] = await db.execute(
        `INSERT INTO students
        (user_id, university, course, year_of_study, phone, location, bio)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            university,
            course,
            yearOfStudy,
            phone,
            location,
            bio
        ]
    );

    return result;
};

const findStudentByUserId = async (userId) => {
    const [rows] = await db.execute(
        `SELECT *
         FROM students
         WHERE user_id = ?`,
        [userId]
    );

    return rows[0];
};

const findStudentById = async (studentId) => {
    const [rows] = await db.execute(
        `SELECT *
         FROM students
         WHERE id = ?`,
        [studentId]
    );

    return rows[0];
};

const updateStudentProfile = async (
    userId,
    university,
    course,
    yearOfStudy,
    phone,
    location,
    bio
) => {
    const [result] = await db.execute(
        `UPDATE students
         SET
            university    = ?,
            course        = ?,
            year_of_study = ?,
            phone         = ?,
            location      = ?,
            bio           = ?
         WHERE user_id = ?`,
        [
            university,
            course,
            yearOfStudy,
            phone,
            location,
            bio,
            userId
        ]
    );

    return result;
};

const getAllStudents = async () => {
    const [rows] = await db.execute(
        `SELECT
            students.*,
            users.name,
            users.email,
            users.created_at AS registered_at
         FROM students
         INNER JOIN users
            ON students.user_id = users.id
         ORDER BY students.id DESC`
    );

    return rows;
};

module.exports = {
    createStudentProfile,
    updateStudentProfile,
    findStudentByUserId,
    findStudentById,
    getAllStudents
};
