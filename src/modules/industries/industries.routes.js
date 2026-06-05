import express from "express";
import expressAsyncHandler from "express-async-handler";

import authorize from "#src/middlewares/authorize.js";

import * as industries from "./industries.controller.js";

const industriesRoutes = express.Router();

industriesRoutes.use(authorize("ADMIN"));

industriesRoutes
	.route("")
	.get(expressAsyncHandler(industries.getAll))
	.post(expressAsyncHandler(industries.create));

industriesRoutes
	.route("/:id")
	.get(expressAsyncHandler(industries.getOne))
	.put(expressAsyncHandler(industries.update))
	.patch(expressAsyncHandler(industries.restore))
	.delete(expressAsyncHandler(industries.destroy));

export default industriesRoutes;
