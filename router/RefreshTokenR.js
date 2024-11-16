import refreshToken from "../controller/RefreshToken.js";
import express from "express";

const refreshRouter = express.Router();

refreshRouter.get("/token", refreshToken);

export default refreshRouter;
