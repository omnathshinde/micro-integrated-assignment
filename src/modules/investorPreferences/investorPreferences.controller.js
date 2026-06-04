import * as preferenceService from "./investorPreferences.service.js";

export const createOrUpdate = async (req, res) => {
	await preferenceService.createOrUpdatePreference(req.user.id, req.body);
	return res.sendSuccess(200, "Preference saved successfully");
};

export const getOne = async (req, res) => {
	const preference = await preferenceService.getPreference(req.user.id);
	if (!preference) {
		return res.sendError(404, "Preference not found");
	}
	return res.sendSuccess(200, preference);
};
