import User from "../model/User.js";
import jwt from "jsonwebtoken";
export async function authMid(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
   

    const { userId } = jwt.verify(token, process.env.SECRET_KEY);

    // const user = await User.findById(id);
console.log("this is a userId from authMidlleware",userId);

    if (userId == null || userId == undefined) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = userId;

    next();
  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }

    throw new Error(error);
  }
}

export function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
