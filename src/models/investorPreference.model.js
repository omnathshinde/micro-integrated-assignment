import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
	class InvestorPreference extends Model {
		static associate({ User }) {
			this.belongsTo(User, { foreignKey: "userId", as: "user" });
		}
	}

	InvestorPreference.init(
		{
			userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
			riskAppetite: {
				type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
				allowNull: false,
			},
			minBudget: { type: DataTypes.DECIMAL(15, 2) },
			maxBudget: { type: DataTypes.DECIMAL(15, 2) },
			preferredIndustries: { type: DataTypes.JSON, allowNull: true },
		},
		{ sequelize, modelName: "InvestorPreference" },
	);

	return InvestorPreference;
};
