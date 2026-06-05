import { Router } from "express";

import analyticsRoutes from "#src/modules/analytics/analytics.routes.js";
import dealsRoutes from "#src/modules/deals/deals.routes.js";
import interestsRoutes from "#src/modules/interests/interests.routes.js";
import investmentRoutes from "#src/modules/investments/investments.routes.js";
import investorPreferenceRoutes from "#src/modules/investorPreference/investorPreference.routes.js";
import userRoutes from "#src/modules/user/user.routes.js";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/investor-preference", investorPreferenceRoutes);
routes.use("/interests", interestsRoutes);
routes.use("/investments", investmentRoutes);
routes.use("/analytics", analyticsRoutes);
routes.use("/deals", dealsRoutes);

export default routes;
