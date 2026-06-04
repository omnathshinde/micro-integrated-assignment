import express from "express";
import expressAsyncHandler from "express-async-handler";

import authorize from "#src/middlewares/authorize.js";

import * as deals from "./deals.controller.js";
import { createValidation } from "./deals.validation.js";

const router = express.Router();

router
	.route("/")
	.get(expressAsyncHandler(deals.getAll))
	.post(authorize("CORPORATE"), createValidation, expressAsyncHandler(deals.create));

router
	.route("/:id")
	.get(expressAsyncHandler(deals.getOne))
	.put(authorize("CORPORATE"), expressAsyncHandler(deals.update))
	.delete(authorize("CORPORATE"), expressAsyncHandler(deals.destroy));

router.get("/recommended", authorize("INVESTOR"), expressAsyncHandler(deals.recommended));

export default router;
