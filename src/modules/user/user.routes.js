import express from "express";
import expressAsyncHandler from "express-async-handler";

import authorize from "#src/middlewares/authorize.js";

import * as user from "./user.controller.js";

const userRoutes = express.Router();

userRoutes.use(authorize("ADMIN"));

userRoutes
	.route("")
	.get(expressAsyncHandler(user.getAll))
	.post(expressAsyncHandler(user.create));

userRoutes
	.route("/:id")
	.get(expressAsyncHandler(user.getOne))
	.put(expressAsyncHandler(user.update))
	.patch(expressAsyncHandler(user.restore))
	.delete(expressAsyncHandler(user.destroy));

export default userRoutes;
