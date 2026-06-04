import logger from "#src/app/configs/logger.js";

export default (...roles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.sendError(401, "Unauthorized user");
		}
		if (!roles.includes(req.user.role)) {
			logger.warn(`Access denied for user ${req.user.username} (${req.user.role})`);
			return res.sendError(403, "Access denied");
		}
		next();
	};
};
