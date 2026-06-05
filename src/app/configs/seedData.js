import { deals } from "#src/app/seed/deals.js";
import { industries } from "#src/app/seed/industries.js";
import { investorPreferences } from "#src/app/seed/investorPreferences.js";
import { AdminUser, CorporateUsers, InvestorUsers } from "#src/app/seed/user.js";
import {
	Deal,
	Industry,
	InvestorPreference,
	InvestorPreferredIndustry,
	sequelize,
	User,
} from "#src/models/index.js";

export default async () => {
	const transaction = await sequelize.transaction();

	try {
		// Industries
		await Industry.bulkCreate(industries, {
			ignoreDuplicates: true,
			transaction,
			logging: false,
		});

		// Users
		await User.bulkCreate([AdminUser, ...CorporateUsers, ...InvestorUsers], {
			ignoreDuplicates: true,
			transaction,
			logging: false,
		});

		// Lookup data
		const [users, industryRecords] = await Promise.all([
			User.findAll({
				attributes: ["id", "username"],
				transaction,
			}),
			Industry.findAll({
				attributes: ["id", "name"],
				transaction,
			}),
		]);

		const userMap = Object.fromEntries(users.map((user) => [user.username, user.id]));

		const industryMap = Object.fromEntries(
			industryRecords.map((industry) => [industry.name, industry.id]),
		);

		// Deals
		for (const dealData of deals) {
			const corporateId = userMap[dealData.corporateUsername];
			const industryId = industryMap[dealData.industryName];

			if (!corporateId || !industryId) {
				console.warn(
					`⚠️ Skipping deal "${dealData.companyName}" - user or industry not found`,
				);
				continue;
			}

			const { ...dealPayload } = dealData;

			await Deal.findOrCreate({
				where: {
					companyName: dealPayload.companyName,
				},
				defaults: {
					...dealPayload,
					corporateId,
					industryId,
				},
				transaction,
			});
		}

		// Investor Preferences
		for (const preferenceData of investorPreferences) {
			const userId = userMap[preferenceData.username];

			if (!userId) {
				console.warn(`⚠️ Skipping preference for ${preferenceData.username}`);
				continue;
			}

			const [preference] = await InvestorPreference.findOrCreate({
				where: {
					userId,
				},
				defaults: {
					userId,
					riskAppetite: preferenceData.riskAppetite,
					minBudget: preferenceData.minBudget,
					maxBudget: preferenceData.maxBudget,
				},
				transaction,
			});

			const industryLinks = preferenceData.industries
				.map((industryName) => industryMap[industryName])
				.filter(Boolean)
				.map((industryId) => ({
					investorPreferenceId: preference.id,
					industryId,
				}));

			if (industryLinks.length) {
				await InvestorPreferredIndustry.bulkCreate(industryLinks, {
					ignoreDuplicates: true,
					transaction,
				});
			}
		}

		await transaction.commit();

		console.log("✅ Seed completed successfully");
		console.log(`• Industries: ${industries.length}`);
		console.log(`• Deals: ${deals.length}`);
		console.log(`• Users: ${1 + CorporateUsers.length + InvestorUsers.length}`);
		console.log(`• Investor Preferences: ${investorPreferences.length}`);
	} catch (error) {
		await transaction.rollback();

		if (error.name === "SequelizeUniqueConstraintError") {
			console.log("🔰 Admin already exists (caught unique constraint)");
		} else {
			console.error("❌ Failed to seed admin user:", error);
		}
	}
};
