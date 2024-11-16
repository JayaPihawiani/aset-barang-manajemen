import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import db from "./config/Database.js";
import authRouter from "./router/AuthRouter.js";
import brgRouter from "./router/BarangRouter.js";
import hapusRouter from "./router/PenghapusanR.js";
import refreshRouter from "./router/RefreshTokenR.js";
import userRouter from "./router/UserRouter.js";
import reqRouter from "./router/RequestRouter.js";
// import Barang from "./models/BarangModel.js";
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
app.set("view engine", "ejs");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/barang", brgRouter);
app.use("/api", authRouter);
app.use("/api", refreshRouter);
app.use("/api/hapus", hapusRouter);
app.use("/api/request", reqRouter);

app.get("/", (req, res) => {
  res.render("index", { title: "EJS" });
});

app.listen(port, () => console.log("Server running on port", port));
