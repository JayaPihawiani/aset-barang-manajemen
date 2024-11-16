import {
  createBarang,
  getBarang,
  getBarangById,
  updateBarang,
  deleteBarang,
} from "../controller/BarangController.js";
import verifyAccess from "../middleware/AccessToken.js";
import express from "express";

const brgRouter = express.Router();

brgRouter.post("/", verifyAccess, createBarang);
brgRouter.get("/", verifyAccess, getBarang);
brgRouter.get("/:id", verifyAccess, getBarangById);
brgRouter.patch("/:id", verifyAccess, updateBarang);
brgRouter.delete("/:id", verifyAccess, deleteBarang);

export default brgRouter;
