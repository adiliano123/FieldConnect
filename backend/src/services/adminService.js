const studentModel     = require("../models/studentModel");
const companyModel     = require("../models/companyModel");
const opportunityModel = require("../models/opportunityModel");
const applicationModel = require("../models/applicationModel");

const getAllStudents = async () => {
    return await studentModel.getAllStudents();
};

const getAllCompanies = async () => {
    return await companyModel.getAllCompanies();
};

const getAllOpportunities = async () => {
    return await opportunityModel.getAllOpportunitiesAdmin();
};

const getAllApplications = async () => {
    return await applicationModel.getAllApplications();
};

const verifyCompany = async (companyId, isVerified) => {
    const company = await companyModel.findCompanyById(companyId);

    if (!company) {
        throw new Error("Company not found");
    }

    await companyModel.verifyCompany(companyId, isVerified);

    return { id: companyId, is_verified: isVerified };
};

const deleteOpportunity = async (opportunityId) => {
    const opportunity = await opportunityModel.getOpportunityById(opportunityId);

    if (!opportunity) {
        throw new Error("Opportunity not found");
    }

    await opportunityModel.deleteOpportunityAdmin(opportunityId);
};

module.exports = {
    getAllStudents,
    getAllCompanies,
    getAllOpportunities,
    getAllApplications,
    verifyCompany,
    deleteOpportunity
};
