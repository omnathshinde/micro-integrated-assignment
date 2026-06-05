import { InvestorPreference, InvestorPreferredIndustry } from "#src/models/index.js";

export const create = async (req, res) => {
	const userId = req.user.id;
	const { riskAppetite, minBudget, maxBudget, industryIds = [] } = req.body;

	const transaction = req.transaction;

	const existing = await InvestorPreference.findOne({
		where: { userId },
		transaction,
	});

	if (existing) {
		return res.sendError(409, "Investor preference already exists. Use update API.");
	}

	const preference = await InvestorPreference.create(
		{
			userId,
			riskAppetite,
			minBudget,
			maxBudget,
		},
		{
			transaction,
		},
	);

	if (industryIds.length) {
		const uniqueIndustryIds = [...new Set(industryIds)];

		await InvestorPreferredIndustry.bulkCreate(
			uniqueIndustryIds.map((industryId) => ({
				investorPreferenceId: preference.id,
				industryId,
			})),
			{
				transaction,
			},
		);
	}

	return res.sendSuccess(201, "Investor preference created successfully");
};

export const update = async (req, res) => {
	const userId = req.user.id;
	const { riskAppetite, minBudget, maxBudget, industryIds = [] } = req.body;

	const transaction = req.transaction;

	const preference = await InvestorPreference.findOne({
		where: { userId },
		transaction,
	});

	if (!preference) {
		return res.sendError(404, "Investor preference not found");
	}

	await preference.update(
		{
			riskAppetite,
			minBudget,
			maxBudget,
		},
		{
			transaction,
		},
	);

	const uniqueIndustryIds = [...new Set(industryIds)];

	// Existing mappings
	const existingMappings = await InvestorPreferredIndustry.findAll({
		where: {
			investorPreferenceId: preference.id,
		},
		transaction,
	});

	const existingIndustryIds = existingMappings.map((item) => item.industryId);

	// Delete removed industries
	await InvestorPreferredIndustry.destroy({
		where: {
			investorPreferenceId: preference.id,
			industryId: existingIndustryIds.filter(
				(id) => !uniqueIndustryIds.includes(id),
			),
		},
		transaction,
	});

	// Insert only new industries
	const newIndustryIds = uniqueIndustryIds.filter(
		(id) => !existingIndustryIds.includes(id),
	);

	if (newIndustryIds.length) {
		await InvestorPreferredIndustry.bulkCreate(
			newIndustryIds.map((industryId) => ({
				investorPreferenceId: preference.id,
				industryId,
			})),
			{
				transaction,
			},
		);
	}

	return res.sendSuccess(200, "Investor preference updated successfully");
};

export const getOne = async (req, res) => {
	const userId = req.user.id;

	const data = await InvestorPreference.findOne({
		where: { userId },
		include: [
			{
				association: "preferredIndustries",
				include: [{ association: "industry" }],
			},
		],
	});
	if (!data) {
		return res.sendError(404, "Investor preference not found");
	}
	return res.sendSuccess(200, data);
};
