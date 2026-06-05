import { Deal, Investment } from "#src/models/index.js";

export const createInvestment = async (req) => {
	const { dealId, amount } = req.body;

	const investorId = req.user.id;
	const transaction = req.transaction;

	const deal = await Deal.findByPk(dealId, {
		transaction,
		lock: transaction.LOCK.UPDATE,
	});

	if (!deal) {
		throw new Error("Deal not found");
	}

	if (deal.dealStatus === "CLOSED") {
		throw new Error("Deal is closed");
	}

	if (new Date(deal.closingDate) < new Date()) {
		throw new Error("Deal has expired");
	}

	if (Number(amount) < Number(deal.minInvestment)) {
		throw new Error(`Minimum investment is ${deal.minInvestment}`);
	}

	if (Number(amount) > Number(deal.maxInvestment)) {
		throw new Error(`Maximum investment is ${deal.maxInvestment}`);
	}

	const remaining = Number(deal.targetAmount) - Number(deal.currentRaisedAmount);

	if (Number(amount) > remaining) {
		throw new Error(`Only ${remaining} investment amount is remaining`);
	}

	const investment = await Investment.create(
		{
			investorId,
			dealId,
			amount,
			investmentStatus: "SUCCESS",
		},
		{
			transaction,
		},
	);

	const currentRaisedAmount = Number(deal.currentRaisedAmount) + Number(amount);

	let dealStatus = "PARTIALLY_FILLED";

	if (currentRaisedAmount >= Number(deal.targetAmount)) {
		dealStatus = "CLOSED";
	}

	await deal.update(
		{
			currentRaisedAmount,
			dealStatus,
		},
		{
			transaction,
		},
	);

	return investment;
};

export const getInvestments = async (user) => {
	const where = {};

	if (user.role === "INVESTOR") {
		where.investorId = user.id;
	}

	return Investment.findAll({
		where,
		include: [
			{
				model: Deal,
				as: "deal",
			},
		],
		order: [["createdAt", "DESC"]],
	});
};

export const getInvestment = async (id, investorId) => {
	return Investment.findOne({
		where: { id, investorId },
		include: [
			{
				model: Deal,
				as: "deal",
			},
		],
	});
};
