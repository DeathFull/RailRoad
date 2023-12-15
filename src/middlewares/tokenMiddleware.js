import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";
import passport from "passport";

export function tokenMiddleware(req, res, next) {
  const token = req.cookies["token"];

  if (!token) {
    return res.status(401).json("No token provided");
  }

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json("Invalid token");

    const user = await UserModel.findOne({ _id: decoded._id });
    if (!user) return res.status(403).json("Invalid token");
    if (user.lastEdited.toISOString() !== decoded.lastEdited) {
      res.clearCookie("token");
      return res
        .status(403)
        .json("Your account has been modified, please log in again");
    }

    req.user = user;
    next();
  });
}
