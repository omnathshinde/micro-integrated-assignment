import * as dealService from "./deals.service.js";

export const getAll = async (req, res) => {
	const data = await dealService.getAllDeals(req.query);
	return res.sendSuccess(200, data);
};

export const create = async (req, res) => {
	const deal = await dealService.createDeal(req.user.id, req.body);
	return res.sendSuccess(201, "Deal created successfully", deal);
};

export const getOne = async (req, res) => {
	const deal = await dealService.getDeal(req.params.id);

	if (!deal) {
		return res.sendError(404, "Deal not found");
	}

	return res.sendSuccess(200, deal);
};

export const update = async (req, res) => {
	const deal = await dealService.updateDeal(req.params.id, req.user.id, req.body);
	return res.sendSuccess(200, "Deal updated successfully", deal);
};

export const destroy = async (req, res) => {
	await dealService.deleteDeal(req.params.id, req.user.id);
	return res.sendSuccess(200, "Deal deleted successfully");
};

export const restore = async (req, res) => {
	await dealService.restoreDeal(req, res);
	return res.sendSuccess(200, "Deal deleted successfully");
};

export const recommended = async (req, res) => {
	const { page = 1, limit = 10 } = req.query;
	const data = await dealService.getRecommendedDeals(req.user.id, page, limit);
	return res.sendSuccess(200, data);
};
