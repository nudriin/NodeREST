import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";

export const web = express();
web.use(express.json()); // * karena semua datany akan dibuat dalam bentuk json, maka akan di use json
web.use(publicRouter); // * use publicRouter
web.use(userRouter); // * use userRouter
web.use(errorMiddleware); // * use error middlewarenya