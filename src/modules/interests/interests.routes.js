import express from "express";
import expressAsyncHandler from "express-async-handler";

import authorize from "#src/middlewares/authorize.js";

import * as interests from "./interests.controller.js";

const interestsRouter = express.Router();

interestsRouter.use(authorize("INVESTOR", "ADMIN"));

interestsRouter
	.route("/")
	.post(expressAsyncHandler(interests.create))
	.get(expressAsyncHandler(interests.getAll));

interestsRouter
	.route("/:id")
	.put(expressAsyncHandler(interests.update))
	.delete(expressAsyncHandler(interests.destroy));

export default interestsRouter;
