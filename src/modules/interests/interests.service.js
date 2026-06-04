import { Deal, Interest } from "#src/models/index.js";

export const createInterest = async (investorId, payload) => {
	const { dealId, amount } = payload;

	const deal = await Deal.findByPk(dealId);

	if (!deal) {
		throw new Error("Deal not found");
	}

	const existingInterest = await Interest.findOne({
		where: {
			investorId,
			dealId,
		},
	});

	if (existingInterest) {
		throw new Error("Interest already exists");
	}

	return Interest.create({
		investorId,
		dealId,
		amount,
	});
};

export const getInterests = async (investorId) => {
	return Interest.findAll({
		where: {
			investorId,
		},
		include: [
			{
				model: Deal,
				as: "deal",
			},
		],
		order: [["createdAt", "DESC"]],
	});
};

export const removeInterest = async (id, investorId) => {
	const interest = await Interest.findOne({
		where: {
			id,
			investorId,
		},
	});

	if (!interest) {
		throw new Error("Interest not found");
	}

	await interest.destroy();
};
