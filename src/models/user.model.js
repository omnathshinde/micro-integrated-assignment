import argon2 from "argon2";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
	class User extends Model {
		static associate({ Deal, Interest, Investment, InvestorPreference }) {
			this.hasOne(InvestorPreference, { foreignKey: "userId", as: "preference" });
			this.hasMany(Deal, { foreignKey: "corporateId", as: "deals" });
			this.hasMany(Interest, { foreignKey: "investorId", as: "interests" });
			this.hasMany(Investment, { foreignKey: "investorId", as: "investments" });
		}
	}

	User.init(
		{
			name: { type: DataTypes.STRING, allowNull: false },
			email: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
				validate: { isEmail: true },
			},
			username: { type: DataTypes.STRING, allowNull: false, unique: true },
			password: { type: DataTypes.STRING, allowNull: false },
			role: {
				type: DataTypes.ENUM("ADMIN", "CORPORATE", "INVESTOR"),
				allowNull: false,
				defaultValue: "INVESTOR",
			},
		},
		{
			sequelize,
			modelName: "User",
			defaultScope: { attributes: { exclude: ["password"] } },
			indexes: [{ fields: ["username"] }, { fields: ["createdBy"] }],
			hooks: {
				beforeCreate: async (user) => {
					user.password = await argon2.hash(user.password);
				},
				beforeBulkCreate: async (instances) => {
					await Promise.all(
						instances.map(async (user) => {
							if (user.password) {
								user.password = await argon2.hash(user.password);
							}
						}),
					);
				},
				beforeUpdate: async (user) => {
					if (user.changed("password")) {
						user.password = await argon2.hash(user.password);
					}
				},
				beforeBulkUpdate: async (options) => {
					if (options.attributes.password) {
						options.attributes.password = await argon2.hash(
							options.attributes.password,
						);
					}
				},
			},
		},
	);
	return User;
};
