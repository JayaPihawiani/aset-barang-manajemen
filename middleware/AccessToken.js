import jwt from "jsonwebtoken";

const verifyAccess = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

export default verifyAccess;
