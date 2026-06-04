import express from "express";
import expressAsyncHandler from "express-async-handler";

import authorize from "#src/middlewares/authorize.js";

import * as preferences from "./investorPreferences.controller.js";

const router = express.Router();

router.use(authorize("INVESTOR"));

router
	.route("/")
	.post(expressAsyncHandler(preferences.createOrUpdate))
	.get(expressAsyncHandler(preferences.getOne));

export default router;
