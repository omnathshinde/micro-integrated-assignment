import express from "express";
import expressAsyncHandler from "express-async-handler";

import authorize from "#src/middlewares/authorize.js";

import * as interests from "./interests.controller.js";

const router = express.Router();
router.use(authorize("INVESTOR"));

router
	.route("/")
	.post(expressAsyncHandler(interests.create))
	.get(expressAsyncHandler(interests.getAll));

router.delete("/:id", expressAsyncHandler(interests.destroy));

export default router;
