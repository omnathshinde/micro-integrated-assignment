import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
	class Interest extends Model {
		static associate({ User, Deal }) {
			this.belongsTo(User, { foreignKey: "investorId", as: "investor" });
			this.belongsTo(Deal, { foreignKey: "dealId", as: "deal" });
		}
	}

	Interest.init(
		{
			investorId: { type: DataTypes.INTEGER, allowNull: false },
			dealId: { type: DataTypes.INTEGER, allowNull: false },
			amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
		},
		{
			sequelize,
			modelName: "Interest",
			indexes: [{ unique: true, fields: ["investorId", "dealId"] }],
		},
	);

	return Interest;
};
