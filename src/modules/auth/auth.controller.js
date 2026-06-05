import { Op } from "sequelize";

import logger from "#src/app/configs/logger.js";
import { verifyPassword } from "#src/app/helpers/HashPassword.js";
import { generateToken } from "#src/app/helpers/JsonWebToken.js";
import { User } from "#src/models/index.js";

export const register = async (req, res) => {
	const { name, email, username, password } = req.body;

	if (!name || !email || !username || !password) {
		return res.sendError(400, "Name, email, username and password are required");
	}

	const existingUser = await User.findOne({
		where: {
			[Op.or]: [{ email }, { username }],
		},
	});

	if (existingUser) {
		return res.sendError(
			409,
			existingUser.email === email
				? "Email already exists"
				: "Username already exists",
		);
	}

	const user = await User.create({
		name,
		email,
		username,
		password,
		role: "INVESTOR",
	});

	logger.info(`User registered: ${user.username}`);

	return res.sendSuccess(201, {
		id: user.id,
		name: user.name,
		email: user.email,
		username: user.username,
		role: user.role,
	});
};

export const login = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.sendError(400, "Username and password are required");
	}

	const user = await User.scope(null).findOne({
		where: { username },
		attributes: ["id", "name", "email", "username", "password", "role"],
	});

	if (!user) {
		return res.sendError(401, "Invalid username or password");
	}

	const isValidPassword = await verifyPassword(user.password, password);

	if (!isValidPassword) {
		return res.sendError(401, "Invalid username or password");
	}

	const token = generateToken({
		id: user.id,
		username: user.username,
		role: user.role,
	});

	logger.info(`User logged in: ${user.username}`);

	return res.sendSuccess(200, {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			username: user.username,
			role: user.role,
		},
		token,
	});
};
