const studentModel = require("../models/studentModel");

const createProfile = async (
    userId,
    university,
    course,
    yearOfStudy,
    phone,
    location,
    bio
) => {
    const existingStudent =
        await studentModel.findStudentByUserId(userId);

    if (existingStudent) {
        throw new Error("Student profile already exists");
    }

    const result = await studentModel.createStudentProfile(
        userId,
        university,
        course,
        yearOfStudy,
        phone,
        location,
        bio
    );

    return {
        id: result.insertId,
        userId,
        university,
        course,
        yearOfStudy,
        phone,
        location,
        bio
    };
};

const getProfile = async (userId) => {
    const student =
        await studentModel.findStudentByUserId(userId);

    if (!student) {
        throw new Error("Student profile not found");
    }

    return student;
};

const updateProfile = async (
    userId,
    university,
    course,
    yearOfStudy,
    phone,
    location,
    bio
) => {
    const existing =
        await studentModel.findStudentByUserId(userId);

    if (!existing) {
        // First time saving — create the profile instead
        const result = await studentModel.createStudentProfile(
            userId,
            university || "",
            course     || "",
            yearOfStudy,
            phone,
            location,
            bio
        );

        return { id: result.insertId, userId, university, course, yearOfStudy, phone, location, bio };
    }

    // Keep existing values if new ones are empty
    await studentModel.updateStudentProfile(
        userId,
        university  || existing.university,
        course      || existing.course,
        yearOfStudy ?? existing.year_of_study,
        phone       ?? existing.phone,
        location    ?? existing.location,
        bio         ?? existing.bio
    );

    return await studentModel.findStudentByUserId(userId);
};

module.exports = {
    createProfile,
    getProfile,
    updateProfile
};
