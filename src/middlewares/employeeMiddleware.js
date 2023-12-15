export function employeeMiddleware(req, res, next) {
  if (req.user.role !== "Admin" && req.user.role !== "Employee") {
    return res.status(403).json("Unauthorized");
  }

  next();
}
