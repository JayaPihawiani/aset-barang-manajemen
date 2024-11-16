import argon2 from "argon2";
import { Op } from "sequelize";
import User from "../models/UserModel.js";

export const createUser = async (req, res) => {
  const { name, email, password, confirm_password, role } = req.body;

  if (!name || !email || !password || !confirm_password || !role)
    return res.status(400).json({ msg: "Field ada yang kosong!" });

  if (req.user.uRole !== "admin") return res.sendStatus(403);

  try {
    const checkUser = await User.findOne({ where: { email } });
    if (checkUser)
      return res
        .status(400)
        .json({ msg: "User dengan email ini sudah terdaftar!" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "Password terlalu pendek! Minimal 8 karakter." });

    if (confirm_password !== password)
      return res.status(400).json({ msg: "Konfirmasi password salah!" });

    const hashed = await argon2.hash(password);
    await User.create({ name, email, password: hashed, role });

    res.status(201).json({ msg: "Akun berhasil dibuat." });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["id", "name", "email", "role"],
    });

    if (response.length === 0)
      return res.status(404).json({ msg: "User tidak ditemukan!" });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: { id: req.params.id },
      attributes: ["id", "name", "email", "role"],
    });

    if (!response)
      return res.status(404).json({ msg: "User tidak ditemukan!" });

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (req.user.uRole !== "admin") return res.sendStatus(403);

    const response = await User.findOne({ where: { id: req.params.id } });

    if (!response)
      return res.status(404).json({ msg: "User tidak ditemukan!" });

    if (password === null || password === "") {
      await User.update({ name }, { where: { id: response.id } });
    } else {
      const hashed = await argon2.hash(password);
      await User.update(
        { name, password: hashed },
        { where: { id: response.id } }
      );
    }

    res.status(200).json({ msg: "Berhasil update data akun." });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  if (req.user.uRole !== "admin") return res.sendStatus(403);

  try {
    const checkUser = await User.findOne({
      where: { [Op.and]: [{ id: req.params.id }, { role: "user" }] },
    });

    if (!checkUser) {
      return res.status(404).json({ msg: "Akun tidak ditemukan!" });
    }

    await User.destroy({
      where: { [Op.and]: [{ id: checkUser.id }, { role: "user" }] },
    });

    res.status(200).json({ msg: "Berhasil menghapus akun." });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
