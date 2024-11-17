import puppeteer, { PuppeteerError } from "puppeteer";
import Barang from "../models/BarangModel.js";
import ejs from "ejs";

export const printStockBrg = async (req, res) => {
  try {
    const brg = await Barang.findAll();
    const html = await ejs.renderFile("./views/index.ejs", {
      brg,
      url: process.env.SERVER,
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    await page.emulateMediaType("screen");

    await page.pdf({
      path: "public/pdf/result.pdf",
      format: "A4",
      margin: { top: "10px", bottom: "60px", left: "40px", right: "40px" },
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment;filename:"result.pdf"',
    });

    res.download("public/pdf/result.pdf", "result.pdf");
  } catch (error) {
    res.status(400).json({ msg: error.message, stackTrace: error.stack });
  }
};
