import { Op } from "sequelize";

import logger from "#src/app/configs/logger.js";
import { verifyPassword } from "#src/app/helpers/HashPassword.js";
import { generateRefreshToken, generateToken } from "#src/app/helpers/JsonWebToken.js";
import { User } from "#src/models/index.js";

export const register = async (req, res) => {
	const { name, email, username, password } = req.body;
	if (!name || !email || !username || !password) {
		return res.sendError(400, "Name, email, username and password are required");
	}

	const existingUser = await User.findOne({
		where: { [Op.or]: [{ email }, { username }] },
	});

	if (existingUser) {
		if (existingUser.email === email) {
			return res.sendError(409, "Email already exists");
		}
		return res.sendError(409, "Username already exists");
	}

	const user = await User.create({
		name,
		email,
		username,
		password,
		role: "INVESTOR",
	});

	logger.warn("User Register", { "Register User": user.username });
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

	const accessToken = generateToken({ id: user.id, role: user.role });
	const refreshToken = generateRefreshToken({ id: user.id });

	logger.warn("User Logged", { "Login User": user.username });
	return res.sendSuccess(200, {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			username: user.username,
			role: user.role,
		},
		accessToken,
		refreshToken,
	});
};
