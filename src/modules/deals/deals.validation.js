export const createValidation = (req, res, next) => {
	const { companyName, industryId, riskLevel, targetAmount, closingDate } = req.body;

	if (!companyName || !industryId || !riskLevel || !targetAmount || !closingDate) {
		return res.sendError(400, "Required fields are missing");
	}

	next();
};
