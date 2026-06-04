import { Op } from "sequelize";

import { Deal, Interest, InvestorPreference } from "#src/models/index.js";

import { DEAL_STATUS, RISK_SCORE } from "./deals.constants.js";

export const getAllDeals = async (query) => {
	const { industry, riskLevel, dealStatus, minROI, page = 1, limit = 10 } = query;

	const where = {};

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

	return Deal.findAndCountAll({
		where,
		offset: (Number(page) - 1) * Number(limit),
		limit: Number(limit),
		order: [["createdAt", "DESC"]],
	});
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

export const getRecommendedDeals = async (investorId) => {
	const preference = await InvestorPreference.findOne({
		where: {
			userId: investorId,
		},
	});

	if (!preference) {
		throw new Error("Investor preference not found");
	}

	const deals = await Deal.findAll({
		where: {
			dealStatus: "OPEN",
		},
	});

	const recommendations = await Promise.all(
		deals.map(async (deal) => {
			let score = 0;

			// Risk Match
			if (deal.riskLevel === preference.riskAppetite) {
				score += 30;
			}

			// Industry Match
			if (preference.preferredIndustries?.includes(deal.industry)) {
				score += 25;
			}

			// Budget Match
			if (
				deal.minInvestment >= preference.minBudget &&
				deal.minInvestment <= preference.maxBudget
			) {
				score += 20;
			}

			// ROI Score
			score += Math.min(15, deal.expectedROI / 2);

			// Popularity Score
			const interestCount = await Interest.count({
				where: {
					dealId: deal.id,
				},
			});

			score += Math.min(10, interestCount);

			return {
				...deal.toJSON(),
				matchScore: Math.round(score),
			};
		}),
	);

	return recommendations.sort((a, b) => b.matchScore - a.matchScore);
};
