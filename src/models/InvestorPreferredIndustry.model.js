import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
	class InvestorPreferredIndustry extends Model {
		static associate({ InvestorPreference, Industry }) {
			this.belongsTo(InvestorPreference, {
				foreignKey: "investorPreferenceId",
				as: "preference",
			});
			this.belongsTo(Industry, { foreignKey: "industryId", as: "industry" });
		}
	}

	InvestorPreferredIndustry.init(
		{
			investorPreferenceId: { type: DataTypes.INTEGER, allowNull: false },
			industryId: { type: DataTypes.INTEGER, allowNull: false },
		},
		{
			sequelize,
			modelName: "InvestorPreferredIndustry",
			indexes: [
				{
					unique: true,
					fields: ["investorPreferenceId", "industryId"],
				},
			],
		},
	);
	return InvestorPreferredIndustry;
};
