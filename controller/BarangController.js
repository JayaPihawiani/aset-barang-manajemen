import Barang from "../models/BarangModel.js";
import { DateTime } from "luxon";

export const createBarang = async (req, res) => {
  const { name, desc, qty } = req.body;

  if (!name || !desc || !qty)
    return res.status(400).json({ msg: "Field tidak boleh kosong!" });

  if (req.user.uRole !== "admin") return res.sendStatus(403);

  try {
    await Barang.create({ name, desc, qty });
    res.status(201).json({ msg: "Berhasil menambah barang." });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getBarang = async (req, res) => {
  try {
    const response = await Barang.findAll({
      attributes: ["id", "name", "desc", "qty", "createdAt"],
    });
    if (response.length === 0)
      return res.status(404).json({ msg: "Barang tidak ditemukan!" });

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

export const getBarangById = async (req, res) => {
  try {
    const response = await Barang.findOne({
      where: { id: req.params.id },
      attributes: ["id", "name", "desc", "qty", "createdAt"],
    });
    if (!response)
      return res.status(404).json({ msg: "Barang tidak ditemukan!" });

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

export const updateBarang = async (req, res) => {
  const { name, desc, qty } = req.body;

  if (req.user.uRole !== "admin") return res.sendStatus(403);

  try {
    const response = await Barang.findOne({ where: { id: req.params.id } });
    if (!response)
      return res.status(404).json({ msg: "Barang tidak ditemukan!" });

    await Barang.update({ name, desc, qty }, { where: { id: response.id } });
    res.status(200).json({ msg: "Berhasil mengupdate barang." });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteBarang = async (req, res) => {
  if (req.user.uRole !== "admin") return res.sendStatus(403);

  try {
    const response = await Barang.findOne({ where: { id: req.params.id } });
    if (!response)
      return res.status(404).json({ msg: "Barang tidak ditemukan!" });

    await Barang.destroy({ where: { id: response.id } });
    res.status(200).json({ msg: "Berhasil menghapus barang." });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
