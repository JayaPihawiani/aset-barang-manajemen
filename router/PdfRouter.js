import express from "express";
import { printStockBrg } from "../controller/ConvertPDF.js";
import verifyAccess from "../middleware/AccessToken.js";

const pdfRouter = express.Router();

pdfRouter.get("/", verifyAccess, printStockBrg);

export default pdfRouter;
