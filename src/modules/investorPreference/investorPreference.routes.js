import express from "express";
import expressAsyncHandler from "express-async-handler";

import authorize from "#src/middlewares/authorize.js";

import * as preferences from "./investorPreference.controller.js";

const investorPreferenceRouter = express.Router();

investorPreferenceRouter.use(authorize("INVESTOR"));

investorPreferenceRouter
	.route("/")
	.post(expressAsyncHandler(preferences.create))
	.put(expressAsyncHandler(preferences.update))
	.get(expressAsyncHandler(preferences.getOne));

export default investorPreferenceRouter;
