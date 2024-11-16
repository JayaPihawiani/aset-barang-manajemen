import User from "../models/UserModel.js";
import ReqBarang from "../models/RequestModel.js";
import Barang from "../models/BarangModel.js";
import { DateTime } from "luxon";
import { Op } from "sequelize";

export const createReqBrg = async (req, res) => {
  try {
    const checkBrg = await Barang.findOne({ where: { id: req.params.id } });
    if (!checkBrg)
      return res.status(404).json({ msg: "Barang tidak ditemukan!" });

    await ReqBarang.create({
      tgl_request: new Date(),
      user_id: req.user.uId,
      barang_id: checkBrg.id,
    });

    res.status(201).json({ msg: "Berhasil membuat request." });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getReqBrg = async (req, res) => {
  try {
    let response;
    if (req.user.uRole === "admin") {
      response = await ReqBarang.findAll({
        include: [
          { model: Barang, attributes: ["name", "desc", "qty"] },
          { model: User, attributes: ["name", "email", "role"] },
        ],
        attributes: ["id", "user_id", "barang_id", "createdAt"],
      });
    } else if (req.user.uRole === "user") {
      response = await ReqBarang.findAll({
        where: { user_id: req.user.uId },
        include: [
          { model: Barang, attributes: ["name", "desc", "qty"] },
          { model: User, attributes: ["name", "email", "role"] },
        ],
        attributes: ["id", "createdAt", "user_id", "barang_id"],
      });
    }
    if (response.length === 0) return res.sendStatus(404);

    const formattedRequests = response.map((e) => ({
      ...e.dataValues,
      createdAt: DateTime.fromJSDate(e.createdAt)
        .setZone("Asia/Jakarta")
        .toFormat("yyyy-MM-dd HH:mm:ss ZZ"),
    }));

    res.status(200).json(formattedRequests);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getReqBrgById = async (req, res) => {
  try {
    let response;
    if (req.user.uRole === "admin") {
      response = await ReqBarang.findOne({
        where: { id: req.params.id },
        include: [
          { model: Barang, attributes: ["name", "desc", "qty"] },
          { model: User, attributes: ["name", "email", "role"] },
        ],
        attributes: ["id", "createdAt", "user_id", "barang_id"],
      });
    } else if (req.user.uRole === "user") {
      response = await ReqBarang.findOne({
        where: { [Op.and]: [{ id: req.params.id }, { user_id: req.user.uId }] },
        include: [
          { model: Barang, attributes: ["name", "desc", "qty"] },
          { model: User, attributes: ["name", "email", "role"] },
        ],
        attributes: ["id", "createdAt", "user_id", "barang_id"],
      });
    }

    if (!response) return res.sendStatus(404);

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

export const deleteReqBrg = async (req, res) => {
  try {
    if (req.user.uRole === "admin") {
      const response = await ReqBarang.findOne({
        where: { id: req.params.id },
      });

      if (!response) return res.sendStatus(404);
      await ReqBarang.destroy({ where: { id: response.id } });
      res.status(200).json({ msg: "Berhasil menghapus request!" });
    } else if (req.user.uRole === "user") {
      const response = await ReqBarang.findOne({
        where: { [Op.and]: [{ id: req.params.id }, { user_id: req.user.uId }] },
      });

      if (!response) return res.sendStatus(404);
      await ReqBarang.destroy({ where: { id: response.id } });
      res.status(200).json({ msg: "Berhasil menghapus request!" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
