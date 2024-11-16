import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);

  const user = await User.findAll({ where: { refresh_token: refreshToken } });
  if (!user[0]) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const uId = user[0].id;
    const uName = user[0].name;
    const uRole = user[0].role;

    const authToken = jwt.sign({ uId, uName, uRole }, process.env.AUTH_SECRET, {
      expiresIn: "7m",
    });

    req.user = decoded;
    res.status(200).json({ authToken });
  });
};

export default refreshToken;
