import express from "express";
import expressAsyncHandler from "express-async-handler";

import authorize from "#src/middlewares/authorize.js";

import * as investments from "./investments.controller.js";

const investmentsRouter = express.Router();

investmentsRouter
	.route("/")
	.get(expressAsyncHandler(investments.getAll))
	.post(authorize("INVESTOR"), expressAsyncHandler(investments.create));

investmentsRouter
	.route("/:id")
	.get(expressAsyncHandler(investments.getOne))
	.put(authorize("INVESTOR"), expressAsyncHandler(investments.update))
	.delete(authorize("INVESTOR"), expressAsyncHandler(investments.destroy));

export default investmentsRouter;
