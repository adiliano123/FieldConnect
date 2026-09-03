const companyModel = require("../models/companyModel");

const createProfile = async (
    userId,
    companyName,
    description,
    phone,
    location,
    website
) => {
    const existingCompany =
        await companyModel.findCompanyByUserId(userId);

    if (existingCompany) {
        throw new Error("Company profile already exists");
    }

    const result = await companyModel.createCompanyProfile(
        userId,
        companyName,
        description,
        phone,
        location,
        website
    );

    return {
        id: result.insertId,
        userId,
        companyName,
        description,
        phone,
        location,
        website
    };
};

const getProfile = async (userId) => {
    const company =
        await companyModel.findCompanyByUserId(userId);

    if (!company) {
        throw new Error("Company profile not found");
    }

    return company;
};

const updateProfile = async (
    userId,
    companyName,
    description,
    phone,
    location,
    website
) => {
    const existing =
        await companyModel.findCompanyByUserId(userId);

    if (!existing) {
        // No profile yet — create it
        const result = await companyModel.createCompanyProfile(
            userId,
            companyName || "",
            description,
            phone,
            location,
            website
        );

        return { id: result.insertId, userId, companyName, description, phone, location, website };
    }

    await companyModel.updateCompanyProfile(
        userId,
        companyName || existing.company_name,
        description ?? existing.description,
        phone       ?? existing.phone,
        location    ?? existing.location,
        website     ?? existing.website
    );

    return await companyModel.findCompanyByUserId(userId);
};

module.exports = {
    createProfile,
    getProfile,
    updateProfile
};
