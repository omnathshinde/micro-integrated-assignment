import { col, fn } from "sequelize";

import { Deal, Interest, Investment, User } from "#src/models/index.js";

export const dashboard = async () => {
	const [
		totalDeals,
		totalCorporates,
		totalInvestors,
		totalInterests,
		totalInvestments,
		totalRaised,
		openDeals,
		closedDeals,
	] = await Promise.all([
		Deal.count(),
		User.count({ where: { role: "CORPORATE" } }),
		User.count({ where: { role: "INVESTOR" } }),
		Interest.count(),
		Investment.count(),
		Investment.sum("amount"),
		Deal.count({
			where: { dealStatus: "OPEN" },
		}),
		Deal.count({
			where: { dealStatus: "CLOSED" },
		}),
	]);

	const conversionRate =
		totalInterests > 0
			? Number(((totalInvestments / totalInterests) * 100).toFixed(2))
			: 0;

	return {
		totalDeals,
		openDeals,
		closedDeals,
		totalCorporates,
		totalInvestors,
		totalInterests,
		totalInvestments,
		totalRaised: totalRaised || 0,
		conversionRate,
	};
};

export const trends = async () => {
	return Investment.findAll({
		attributes: [
			[fn("DATE_FORMAT", col("createdAt"), "%Y-%m"), "month"],
			[fn("SUM", col("amount")), "raisedAmount"],
		],
		group: [fn("DATE_FORMAT", col("createdAt"), "%Y-%m")],
		order: [[col("createdAt"), "ASC"]],
		raw: true,
	});
};

export const corporateDashboard = async (corporateId) => {
	const deals = await Deal.findAll({ where: { corporateId } });

	return {
		totalDeals: deals.length,
		openDeals: deals.filter((d) => d.dealStatus === "OPEN").length,
		closedDeals: deals.filter((d) => d.dealStatus === "CLOSED").length,
		totalRaised: deals.reduce(
			(sum, deal) => sum + Number(deal.currentRaisedAmount),
			0,
		),
	};
};

export const investorDashboard = async (investorId) => {
	const [totalInterests, totalInvestments, totalInvestedAmount] = await Promise.all([
		Interest.count({
			where: { investorId },
		}),
		Investment.count({
			where: { investorId },
		}),
		Investment.sum("amount", {
			where: { investorId },
		}),
	]);

	return {
		totalInterests,
		totalInvestments,
		totalInvestedAmount: totalInvestedAmount || 0,
	};
};
