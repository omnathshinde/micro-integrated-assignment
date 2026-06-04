import { verifyToken } from "#src/app/helpers/JsonWebToken.js";

export default (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.sendError(401, "Authorization token is required");
	}

	if (!authHeader.startsWith("Bearer ")) {
		return res.sendError(401, "Invalid authorization format");
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		return res.sendError(401, "Token is required");
	}

	try {
		const decoded = verifyToken(token);
		if (!decoded) {
			return res.sendError(401, "Unauthorizated User");
		}
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.sendError(401, "Your session has expired. Please log in again.");
		} else if (error.name === "JsonWebTokenError") {
			return res.sendError(401, "Invalid User");
		}
		return res.sendError(403, "Access denied");
	}
};
