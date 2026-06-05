import logger from "#src/app/configs/logger.js";

export default (...roles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.sendError(
				401,
				"Authentication required. Please log in to continue.",
			);
		}

		if (!roles.includes(req.user.role)) {
			logger.warn(`Access denied for user ${req.user.username} (${req.user.role})`);
			return res.sendError(
				403,
				"You do not have permission to perform this action.",
			);
		}

		next();
	};
};
