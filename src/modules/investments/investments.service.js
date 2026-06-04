import { Deal, Investment } from "#src/models/index.js";

export const createInvestment = async (req, res) => {
	const payload = req.body;
	const investorId = req.user.id;
	const transaction = req.transaction;

	const { dealId, amount } = payload;

	const deal = await Deal.findByPk(dealId, {
		transaction,
		lock: true,
	});

	if (!deal) {
		return res.sendError(404, "Deal not found");
	}

	if (deal.investmentStatus === "CLOSED") {
		return res.sendError(400, "Deal is closed");
	}

	if (amount < deal.minInvestment) {
		return res.sendError(400, `Minimum investment is ${deal.minInvestment}`);
	}

	if (amount > deal.maxInvestment) {
		return res.sendError(400, `Maximum investment is ${deal.maxInvestment}`);
	}

	const remaining = Number(deal.targetAmount) - Number(deal.currentRaisedAmount);

	if (amount > remaining) {
		return res.sendError(400, "Investment exceeds remaining target amount");
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

	const newRaisedAmount = Number(deal.currentRaisedAmount) + Number(amount);

	let investmentStatus = "PARTIALLY_FILLED";

	if (newRaisedAmount >= deal.targetAmount) {
		investmentStatus = "CLOSED";
	}

	await deal.update(
		{
			currentRaisedAmount: newRaisedAmount,
			investmentStatus,
		},
		{
			transaction,
		},
	);

	return investment;
};

export const getInvestments = async (investorId) => {
	return Investment.findAll({
		where: { investorId },
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
