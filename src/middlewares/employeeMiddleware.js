export function employeeMiddleware(req, res, next) {
  if (req.user.role === "User") {
    return res.status(403).json("Forbidden");
  }

  next();
}
