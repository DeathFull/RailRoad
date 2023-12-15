import { employeeMiddleware } from "./employeeMiddleware.js";

export function checkUserMiddleware(req, res, next) {
  if (req.params.id !== req.user._id.toString()) {
    return employeeMiddleware(req, res, next);
  }

  next();
}
