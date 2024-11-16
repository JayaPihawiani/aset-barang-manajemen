import {
  createPenghapusan,
  getPenghapusan,
  getPenghapusanById,
  deletePenghapusan,
} from "../controller/PenghapusanC.js";
import verifyAccess from "../middleware/AccessToken.js";
import express from "express";

const hapusRouter = express.Router();

hapusRouter.get("/", verifyAccess, getPenghapusan);
hapusRouter.post("/:id", verifyAccess, createPenghapusan);
hapusRouter.get("/:id", verifyAccess, getPenghapusanById);
hapusRouter.delete("/:id", verifyAccess, deletePenghapusan);

export default hapusRouter;
