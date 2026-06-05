import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
	class Industry extends Model {
		static associate({ Deal, InvestorPreferredIndustry }) {
			this.hasMany(Deal, { foreignKey: "industryId", as: "deals" });
			this.hasMany(InvestorPreferredIndustry, {
				foreignKey: "industryId",
				as: "investorPreferences",
			});
		}
	}

	Industry.init(
		{
			name: { type: DataTypes.STRING, allowNull: false, unique: true },
			description: { type: DataTypes.STRING, allowNull: true },
		},
		{
			sequelize,
			modelName: "Industry",
			indexes: [{ fields: ["name"] }],
		},
	);

	return Industry;
};
