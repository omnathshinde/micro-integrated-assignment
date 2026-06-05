import * as interestService from "./interests.service.js";

export const getAll = async (req, res) => {
	const interests = await interestService.getInterests(req.user.id);
	return res.sendSuccess(200, interests);
};

export const create = async (req, res) => {
	const interest = await interestService.createInterest(req.user.id, req.body);
	return res.sendSuccess(201, interest);
};

export const update = async (req, res) => {
	const interest = await interestService.updateInterest(
		req.params.id,
		req.user.id,
		req.body,
	);

	return res.sendSuccess(200, "Interest updated successfully", interest);
};

export const destroy = async (req, res) => {
	await interestService.removeInterest(req.params.id, req.user.id);
	return res.sendSuccess(200, "Interest removed successfully");
};
