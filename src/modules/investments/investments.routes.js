import express from "express";
import expressAsyncHandler from "express-async-handler";

import authorize from "#src/middlewares/authorize.js";

import * as investments from "./investments.controller.js";

const investmentsRouter = express.Router();

investmentsRouter
	.route("/")
	.get(authorize("INVESTOR", "ADMIN"), expressAsyncHandler(investments.getAll))
	.post(authorize("INVESTOR"), expressAsyncHandler(investments.create));

investmentsRouter
	.route("/:id")
	.get(authorize("INVESTOR"), expressAsyncHandler(investments.getOne));

export default investmentsRouter;
