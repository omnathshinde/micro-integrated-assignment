import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
	class Deal extends Model {
		static associate({ User, Industry, Interest, Investment }) {
			this.belongsTo(User, { foreignKey: "corporateId", as: "corporate" });
			this.belongsTo(Industry, { foreignKey: "industryId", as: "industry" });
			this.hasMany(Interest, { foreignKey: "dealId", as: "interests" });
			this.hasMany(Investment, { foreignKey: "dealId", as: "investments" });
		}
	}

	Deal.init(
		{
			corporateId: { type: DataTypes.INTEGER, allowNull: false },
			industryId: { type: DataTypes.INTEGER, allowNull: false },
			companyName: { type: DataTypes.STRING, allowNull: false },
			description: { type: DataTypes.TEXT },
			investmentRequired: { type: DataTypes.DECIMAL(15, 2) },
			expectedROI: { type: DataTypes.FLOAT },
			riskLevel: { type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH") },
			riskScore: { type: DataTypes.INTEGER },
			dealStatus: {
				type: DataTypes.ENUM("OPEN", "PARTIALLY_FILLED", "CLOSED"),
				defaultValue: "OPEN",
			},
			minInvestment: { type: DataTypes.DECIMAL(15, 2) },
			maxInvestment: { type: DataTypes.DECIMAL(15, 2) },
			targetAmount: { type: DataTypes.DECIMAL(15, 2) },
			currentRaisedAmount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
			closingDate: { type: DataTypes.DATE },
			tags: { type: DataTypes.JSON },
		},
		{
			sequelize,
			modelName: "Deal",
			paranoid: true,
			indexes: [
				{ fields: ["industryId"] },
				{ fields: ["riskLevel"] },
				{ fields: ["dealStatus"] },
				{ fields: ["closingDate"] },
			],
		},
	);

	return Deal;
};
