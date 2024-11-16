import { loginUser, logoutUser } from "../controller/AuthUserC.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.delete("/logout", logoutUser);

export default authRouter;
