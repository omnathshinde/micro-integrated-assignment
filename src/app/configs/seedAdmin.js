import { AdminUser } from "#src/app/helpers/AppAdminData.js";
import { sequelize, User } from "#src/models/index.js";

export default async () => {
	const transaction = await sequelize.transaction();

	try {
		const [user, created] = await User.findOrCreate({
			where: {
				username: "admin",
			},
			defaults: {
				name: AdminUser.name,
				email: AdminUser.email,
				username: AdminUser.username,
				password: AdminUser.password,
				role: AdminUser.role,
			},
			transaction,
			logging: false,
		});

		if (created) {
			console.log("✅ Admin user created:", user.username);
		} else {
			console.log("ℹ️ Admin user already exists:", user.username);
		}

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();

		if (error.name === "SequelizeUniqueConstraintError") {
			console.log("🔰 Admin already exists (caught unique constraint)");
		} else {
			console.error("❌ Failed to seed admin user:", error);
		}
	}
};
