import * as analyticsService from "./analytics.service.js";

export const dashboard = async (req, res) => {
	const data = await analyticsService.dashboard();
	return res.sendSuccess(200, "Analytics dashboard fetched successfully", data);
};

export const trends = async (req, res) => {
	const data = await analyticsService.trends();
	return res.sendSuccess(200, "Analytics trends fetched successfully", data);
};

export const corporateDashboard = async (req, res) => {
	const data = await analyticsService.corporateDashboard(req.user.id);
	return res.sendSuccess(200, "Corporate dashboard fetched successfully", data);
};

export const investorDashboard = async (req, res) => {
	const data = await analyticsService.investorDashboard(req.user.id);
	return res.sendSuccess(200, "Investor dashboard fetched successfully", data);
};
