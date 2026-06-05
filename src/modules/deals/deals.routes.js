import express from "express";
import expressAsyncHandler from "express-async-handler";

import authorize from "#src/middlewares/authorize.js";

import * as deals from "./deals.controller.js";
import { createValidation } from "./deals.validation.js";

const dealsRoutes = express.Router();

dealsRoutes
	.route("/")
	.get(expressAsyncHandler(deals.getAll))
	.post(authorize("CORPORATE"), createValidation, expressAsyncHandler(deals.create));

dealsRoutes
	.route("/recommended")
	.get(authorize("INVESTOR"), expressAsyncHandler(deals.recommended));

dealsRoutes
	.route("/:id")
	.get(expressAsyncHandler(deals.getOne))
	.put(authorize("CORPORATE"), expressAsyncHandler(deals.update))
	.delete(authorize("CORPORATE"), expressAsyncHandler(deals.destroy))
	.patch(authorize("CORPORATE"), expressAsyncHandler(deals.restore));

export default dealsRoutes;
