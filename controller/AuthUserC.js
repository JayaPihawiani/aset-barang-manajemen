import User from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Field tidak boleh kosong!" });

  try {
    const checkEmail = await User.findOne({ where: { email } });
    if (!checkEmail)
      return res
        .status(404)
        .json({ msg: "Akun dengan email ini tidak terdaftar!" });

    const validatePassword = await argon2.verify(checkEmail.password, password);
    if (!validatePassword)
      return res.status(400).json({ msg: "Password yang dimasukkan salah!" });

    const uId = checkEmail.id;
    const uName = checkEmail.name;
    const uRole = checkEmail.role;

    const authToken = jwt.sign({ uId, uName, uRole }, process.env.AUTH_SECRET, {
      expiresIn: "10m",
    });

    const refreshToken = jwt.sign(
      { uId, uName, uRole },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "8h",
      }
    );

    await User.update({ refresh_token: refreshToken }, { where: { id: uId } });

    // set cookie auth access
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 8,
    });

    res.status(200).json({ authToken });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(204);

  try {
    const user = await User.findAll({ where: { refresh_token: refreshToken } });
    if (!user[0]) return res.sendStatus(204);

    await User.update({ refresh_token: null }, { where: { id: user[0].id } });

    // clear cookie
    res.clearCookie("refreshToken");
    res.status(200).json({ msg: "Berhasil logout." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
