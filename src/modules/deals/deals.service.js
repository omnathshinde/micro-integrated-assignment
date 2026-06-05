import { Op } from "sequelize";

import {
	Deal,
	Interest,
	InvestorPreference,
	InvestorPreferredIndustry,
} from "#src/models/index.js";

import { DEAL_STATUS, RISK_SCORE } from "./deals.constants.js";

export const getAllDeals = async (query) => {
	const {
		status = 1,
		industry,
		riskLevel,
		dealStatus,
		minROI,
		page = 1,
		limit = 10,
	} = query;

	const where = {};
	const options = {
		where,
		offset: (Number(page) - 1) * Number(limit),
		limit: Number(limit),
		order: [["createdAt", "DESC"]],
	};

	if (status === "0" || status === "false") {
		options.paranoid = false;
		where.deletedAt = {
			[Op.ne]: null,
		};
	}

	if (status === "1" || status === "true") {
		where.deletedAt = null;
	}

	if (status) {
		where.status = status;
	}
	if (industry) {
		where.industry = industry;
	}

	if (riskLevel) {
		where.riskLevel = riskLevel;
	}

	if (dealStatus) {
		where.dealStatus = dealStatus;
	}

	if (minROI) {
		where.expectedROI = {
			[Op.gte]: Number(minROI),
		};
	}

	return Deal.findAndCountAll(options);
};

export const createDeal = async (userId, payload) => {
	return Deal.create({
		...payload,
		corporateId: userId,
		riskScore: RISK_SCORE[payload.riskLevel],
		dealStatus: DEAL_STATUS.OPEN,
		currentRaisedAmount: 0,
	});
};

export const getDeal = async (id) => {
	return Deal.findByPk(id);
};

export const updateDeal = async (id, userId, payload) => {
	const deal = await Deal.findByPk(id);

	if (!deal) {
		throw new Error("Deal not found");
	}

	if (deal.corporateId !== userId) {
		throw new Error("Access denied");
	}

	await deal.update(payload);

	return deal;
};

export const deleteDeal = async (id, userId) => {
	const deal = await Deal.findByPk(id);

	if (!deal) {
		throw new Error("Deal not found");
	}

	if (deal.corporateId !== userId) {
		throw new Error("Access denied");
	}

	await deal.destroy();
};

export const restoreDeal = async (req, res) => {
	const data = await Deal.restore({ where: { id: req.params.id } });
	if (!data) {
		return res.sendError(404, "Deal not found");
	}
	return res.sendSuccess(200, "Deal restored successfully");
};

export const getRecommendedDeals = async (investorId, page = 1, limit = 10) => {
	const preference = await InvestorPreference.findOne({
		where: {
			userId: investorId,
		},
		include: [
			{
				model: InvestorPreferredIndustry,
				as: "preferredIndustries",
				attributes: ["industryId"],
			},
		],
	});

	if (!preference) {
		throw new Error("Investor preference not found");
	}

	const preferredIndustryIds = preference.preferredIndustries.map(
		(item) => item.industryId,
	);

	const deals = await Deal.findAll({
		where: {
			dealStatus: "OPEN",
			status: true,
		},
		include: [
			{
				model: Interest,
				as: "interests",
				attributes: ["id"],
				required: false,
			},
		],
	});

	const recommendations = deals.map((deal) => {
		let score = 0;

		// Risk Match (30%)
		if (deal.riskLevel === preference.riskAppetite) {
			score += 30;
		}

		// Industry Match (25%)
		if (preferredIndustryIds.includes(deal.industryId)) {
			score += 25;
		}

		// Budget Compatibility (20%)
		if (
			Number(deal.minInvestment) <= Number(preference.maxBudget) &&
			Number(deal.maxInvestment) >= Number(preference.minBudget)
		) {
			score += 20;
		}

		// ROI Attractiveness (15%)
		score += Math.min(15, Number(deal.expectedROI) / 2);

		// Popularity (10%)
		score += Math.min(10, deal.interests?.length || 0);

		return {
			...deal.toJSON(),
			matchScore: Math.round(score),
		};
	});

	const sortedDeals = recommendations.sort((a, b) => b.matchScore - a.matchScore);

	const offset = (Number(page) - 1) * Number(limit);

	return {
		count: sortedDeals.length,
		rows: sortedDeals.slice(offset, offset + Number(limit)),
	};
};
