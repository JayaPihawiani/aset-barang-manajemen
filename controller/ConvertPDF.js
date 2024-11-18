import ejs from "ejs";
import { DateTime } from "luxon";
import puppeteer from "puppeteer";
import Barang from "../models/BarangModel.js";
import Penghapusan from "../models/PenghapusanM.js";

export const printStockBrg = async (req, res) => {
  try {
    const brgAll = await Barang.findAll({ order: [["createdAt", "ASC"]] });
    const formatted = brgAll.map((e) => ({
      ...e.dataValues,
      createdAt: DateTime.fromJSDate(e.createdAt)
        .setZone("Asia/Jakarta")
        .toFormat("yyyy-MM-dd HH:mm:ss"),
    }));
    const html = await ejs.renderFile("./views/index.ejs", {
      brg: formatted,
      url: process.env.SERVER,
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    await page.emulateMediaType("screen");

    await page.pdf({
      path: "public/pdf/barang.pdf",
      format: "A4",
      margin: { top: "10px", bottom: "60px", left: "40px", right: "40px" },
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment;filename="barang.pdf"',
    });

    res.download("public/pdf/barang.pdf", "barang.pdf");
  } catch (error) {
    res.status(400).json({ msg: error.message, stackTrace: error.stack });
  }
};

export const printPenghapusan = async (req, res) => {
  try {
    const hapus = await Penghapusan.findAll({
      order: [["createdAt", "ASC"]],
      include: {
        model: Barang,
        attributes: ["name", "desc", "qty"],
      },
      attributes: ["id", "createdAt", "barang_id"],
    });
    const formatted = hapus.map((e) => ({
      ...e.dataValues,
      createdAt: DateTime.fromJSDate(e.createdAt)
        .setZone("Asia/Jakarta")
        .toFormat("yyyy-MM-dd HH:mm:ss"),
    }));

    const html = await ejs.renderFile("./views/penghapusan.ejs", {
      hps: formatted,
      url: process.env.SERVER,
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    await page.emulateMediaType("screen");

    await page.pdf({
      path: "public/pdf/penghapusan.pdf",
      format: "A4",
      margin: { top: "10px", bottom: "60px", left: "40px", right: "40px" },
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment;filename="penghapusan.pdf"',
    });

    res.download("public/pdf/penghapusan.pdf", "penghapusan.pdf");
  } catch (error) {
    res.status(400).json({ msg: error.message, stackTrace: error.stack });
  }
};
