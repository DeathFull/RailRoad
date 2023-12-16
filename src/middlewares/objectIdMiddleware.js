import { Types } from "mongoose";

export function objectIdMiddleware(req, res, next) {
  if (!req.params.id || !Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Bad Request");
  }
  next();
}
