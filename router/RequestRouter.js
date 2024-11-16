import {
  createReqBrg,
  getReqBrg,
  getReqBrgById,
  deleteReqBrg,
} from "../controller/RequestController.js";
import verifyAccess from "../middleware/AccessToken.js";
import express from "express";

const reqRouter = express.Router();

reqRouter.post("/:id", verifyAccess, createReqBrg);
reqRouter.get("/:id", verifyAccess, getReqBrgById);
reqRouter.delete("/:id", verifyAccess, deleteReqBrg);
reqRouter.get("/", verifyAccess, getReqBrg);

export default reqRouter;
