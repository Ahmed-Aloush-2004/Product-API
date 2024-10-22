import User from "../model/User.js";
import jwt  from "jsonwebtoken"
export async function authMid(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = jwt.verify(token, process.env.SECRET_KEY);

  const user = await User.findById(id);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;

  next();
}

export function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

