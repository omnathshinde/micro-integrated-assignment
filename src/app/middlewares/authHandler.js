import { verifyToken } from "#src/app/helpers/JsonWebToken.js";

export default (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.sendError(401, "Authorization token is required");
	}

	if (!authHeader.startsWith("Bearer ")) {
		return res.sendError(401, "Invalid authorization format. Use Bearer <token>");
	}

	const token = authHeader.split(" ")[1];
	const decoded = verifyToken(token);

	if (!decoded) {
		return res.sendError(401, "Invalid or expired token");
	}

	req.user = decoded;
	next();
};
