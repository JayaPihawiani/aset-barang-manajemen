import express from "express";
import { printStockBrg, printPenghapusan } from "../controller/ConvertPDF.js";
import verifyAccess from "../middleware/AccessToken.js";

const pdfRouter = express.Router();

pdfRouter.get("/barang", verifyAccess, printStockBrg);
pdfRouter.get("/hapus", printPenghapusan);

export default pdfRouter;
