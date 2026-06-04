import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
	class Investment extends Model {
		static associate({ User, Deal }) {
			this.belongsTo(User, { foreignKey: "investorId", as: "investor" });
			this.belongsTo(Deal, { foreignKey: "dealId", as: "deal" });
		}
	}

	Investment.init(
		{
			investorId: { type: DataTypes.INTEGER, allowNull: false },
			dealId: { type: DataTypes.INTEGER, allowNull: false },
			amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
			investmentStatus: {
				type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
				defaultValue: "PENDING",
			},
		},
		{ sequelize, modelName: "Investment" },
	);

	return Investment;
};
