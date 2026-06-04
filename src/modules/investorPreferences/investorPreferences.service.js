import { InvestorPreference } from "#src/models/index.js";

export const createOrUpdatePreference = async (userId, payload) => {
	const [preference] = await InvestorPreference.upsert(
		{ userId, ...payload },
		{ returning: true },
	);
	return preference;
};

export const getPreference = async (userId) => {
	return InvestorPreference.findOne({
		where: { userId },
	});
};
