import {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/UserController.js";
import verifyAccess from "../middleware/AccessToken.js";
import express from "express";

const userRouter = express.Router();

userRouter.post("/", verifyAccess, createUser);
userRouter.get("/", verifyAccess, getUser);
userRouter.get("/:id", verifyAccess, getUserById);
userRouter.patch("/:id", verifyAccess, updateUser);
userRouter.delete("/:id", verifyAccess, deleteUser);

export default userRouter;
