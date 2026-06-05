import express from "express";
import expressAsyncHandler from "express-async-handler";

import authorize from "#src/middlewares/authorize.js";

import * as analytics from "./analytics.controller.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/trends", authorize("ADMIN"), expressAsyncHandler(analytics.trends));

analyticsRouter.get(
	"/dashboard",
	authorize("ADMIN"),
	expressAsyncHandler(analytics.dashboard),
);

analyticsRouter.get(
	"/corporate",
	authorize("CORPORATE"),
	expressAsyncHandler(analytics.corporateDashboard),
);

analyticsRouter.get(
	"/investor",
	authorize("INVESTOR"),
	expressAsyncHandler(analytics.investorDashboard),
);

export default analyticsRouter;
