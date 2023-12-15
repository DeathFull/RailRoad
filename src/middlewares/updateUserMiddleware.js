import { adminMiddleware } from "./adminMiddleware.js";

export function updateUserMiddleware(req, res, next) {
  if (req.params.id !== req.user._id.toString()) {
    return adminMiddleware(req, res, next);
  }

  next();
}
