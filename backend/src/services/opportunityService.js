const opportunityModel = require("../models/opportunityModel");
const companyModel = require("../models/companyModel");

const createOpportunity = async (
    userId,
    title,
    description,
    type,
    category,
    location,
    requirements,
    positions,
    deadline
) => {
    const company =
        await companyModel.findCompanyByUserId(userId);

    if (!company) {
        throw new Error("Company profile not found");
    }

    const result = await opportunityModel.createOpportunity(
        company.id,
        title,
        description,
        type,
        category,
        location,
        requirements,
        positions,
        deadline
    );

    return {
        id: result.insertId,
        companyId: company.id,
        title,
        description,
        type,
        category,
        location,
        requirements,
        positions,
        deadline,
        status: "open"
    };
};

const getAllOpportunities = async () => {
    return await opportunityModel.getAllOpportunities();
};

const getOpportunityById = async (id) => {
    const opportunity =
        await opportunityModel.getOpportunityById(id);

    if (!opportunity) {
        throw new Error("Opportunity not found");
    }

    return opportunity;
};

const getMyOpportunities = async (userId) => {
    const company =
        await companyModel.findCompanyByUserId(userId);

    if (!company) {
        throw new Error("Company profile not found");
    }

    return await opportunityModel.getOpportunitiesByCompany(
        company.id
    );
};

const updateOpportunity = async (
    userId,
    opportunityId,
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
    const company =
        await companyModel.findCompanyByUserId(userId);

    if (!company) {
        throw new Error("Company profile not found");
    }

    // Load existing so we can keep unchanged fields
    const existing =
        await opportunityModel.getOpportunityById(opportunityId);

    if (!existing || existing.company_id !== company.id) {
        throw new Error(
            "Opportunity not found or you do not own this opportunity"
        );
    }

    const result = await opportunityModel.updateOpportunity(
        opportunityId,
        company.id,
        title        ?? existing.title,
        description  ?? existing.description,
        type         ?? existing.type,
        category     ?? existing.category,
        location     ?? existing.location,
        requirements ?? existing.requirements,
        positions    ?? existing.positions,
        deadline     ?? existing.deadline,
        status       ?? existing.status
    );

    if (result.affectedRows === 0) {
        throw new Error("Unable to update opportunity");
    }

    return { message: "Opportunity updated successfully" };
};

const deleteOpportunity = async (
    userId,
    opportunityId
) => {
    const company =
        await companyModel.findCompanyByUserId(userId);

    if (!company) {
        throw new Error("Company profile not found");
    }

    const result = await opportunityModel.deleteOpportunity(
        opportunityId,
        company.id
    );

    if (result.affectedRows === 0) {
        throw new Error(
            "Opportunity not found or you do not own this opportunity"
        );
    }

    return {
        message: "Opportunity deleted successfully"
    };
};

module.exports = {
    createOpportunity,
    getAllOpportunities,
    getOpportunityById,
    getMyOpportunities,
    updateOpportunity,
    deleteOpportunity
};