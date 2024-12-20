import Barang from "../models/BarangModel.js";
import Penghapusan from "../models/PenghapusanM.js";
import { DateTime } from "luxon";

export const createPenghapusan = async (req, res) => {
  if (req.user.uRole !== "admin") return res.sendStatus(403);

  try {
    const checkBrg = await Barang.findOne({ where: { id: req.params.id } });
    if (!checkBrg)
      return res.status(404).json({ msg: "Barang tidak ditemukan!" });

    const checkHapus = await Penghapusan.findOne({
      where: { barang_id: checkBrg.id },
    });

    if (checkHapus)
      return res
        .status(400)
        .json({ msg: "Item ini sudah masuk dalam daftar penghapusan!" });

    await Penghapusan.create({
      barang_id: checkBrg.id,
    });

    res.status(201).json({ msg: "Berhasil memasukkan kedaftar penghapusan." });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getPenghapusan = async (req, res) => {
  try {
    const response = await Penghapusan.findAll({
      include: { model: Barang, attributes: ["name", "desc", "qty"] },
      attributes: ["id", "barang_id", "createdAt"],
    });

    if (response.length === 0)
      return res.status(404).json({ msg: "Data penghapusan tidak ditemukan!" });

    const formatted = response.map((e) => ({
      ...e.dataValues,
      createdAt: DateTime.fromJSDate(e.createdAt)
        .setZone("Asia/Jakarta")
        .toFormat("yyyy-MM-dd HH:mm:ss ZZ"),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getPenghapusanById = async (req, res) => {
  try {
    const response = await Penghapusan.findOne({
      where: { id: req.params.id },
      include: { model: Barang, attributes: ["name", "desc", "qty"] },
      attributes: ["id", "barang_id", "createdAt"],
    });

    if (!response)
      return res.status(404).json({ msg: "Data Penghapusan tidak ditemukan!" });

    const formatted = {
      ...response.dataValues,
      createdAt: DateTime.fromJSDate(response.createdAt)
        .setZone("Asia/Jakarta")
        .toFormat("yyyy-MM-dd HH:mm:ss ZZ"),
    };

    res.status(200).json(formatted);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deletePenghapusan = async (req, res) => {
  if (req.user.uRole !== "admin") return res.sendStatus(403);
  try {
    const checkItemHapus = await Penghapusan.findOne({
      where: { id: req.params.id },
    });

    if (!checkItemHapus)
      return res.status(404).json({ msg: "Data Penghapusan tidak ditemukan!" });
    await Penghapusan.destroy({ where: { id: checkItemHapus.id } });

    res.status(200).json({ msg: "Berhasil menghapus data Penghapusan." });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
