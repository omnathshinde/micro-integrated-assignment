export const createValidation = (req, res, next) => {
	const { companyName, industry, riskLevel, targetAmount, closingDate } = req.body;

	if (!companyName || !industry || !riskLevel || !targetAmount || !closingDate) {
		return res.sendError(400, "Required fields are missing");
	}

	next();
};
