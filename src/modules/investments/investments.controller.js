import * as investmentService from "./investments.service.js";

export const getAll = async (req, res) => {
	const investments = await investmentService.getInvestments(req.user.id);
	return res.sendSuccess(200, "Investments fetched successfully", investments);
};

export const getOne = async (req, res) => {
	const investment = await investmentService.getInvestment(req.params.id, req.user.id);
	if (!investment) {
		return res.sendError(404, "Investment not found");
	}
	return res.sendSuccess(200, "Investment fetched successfully", investment);
};

export const create = async (req, res) => {
	const investment = await investmentService.createInvestment(req, res);
	return res.sendSuccess(201, "Investment created successfully", investment);
};
