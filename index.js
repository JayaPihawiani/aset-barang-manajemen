import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import db from "./config/Database.js";
// import { fileURLToPath } from "url";
// import path, { dirname } from "path";
// ---> router <---
import authRouter from "./router/AuthRouter.js";
import brgRouter from "./router/BarangRouter.js";
import hapusRouter from "./router/PenghapusanR.js";
import refreshRouter from "./router/RefreshTokenR.js";
import userRouter from "./router/UserRouter.js";
import reqRouter from "./router/RequestRouter.js";
import pdfRouter from "./router/PdfRouter.js";
import Barang from "./models/BarangModel.js";
// import User from "./models/UserModel.js";
// import ReqBarang from "./models/RequestModel.js";
// import Penghapusan from "./models/PenghapusanM.js";

try {
  await db.authenticate();
  // await db.sync({ alter: true });
  console.log("Database connected");
} catch (error) {
  console.log(error.message);
}

dotenv.config();
const port = process.env.PORT;
const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

app.set("view engine", "ejs");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
// app.use("/img", express.static(path.join(__dirname, "public/img")));

app.use("/api/user", userRouter);
app.use("/api/barang", brgRouter);
app.use("/api", authRouter);
app.use("/api", refreshRouter);
app.use("/api/hapus", hapusRouter);
app.use("/api/request", reqRouter);
app.use("/api/pdf", pdfRouter);

app.get("/", async (req, res) => {
  const brg = await Barang.findAll();
  res.render("index", { brg, url: process.env.SERVER });
});

app.listen(port, () => console.log("Server running on port", port));
