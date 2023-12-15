export function adminMiddleware(req, res, next) {
  if (req.user.role !== "Admin") {
    return res.status(403).json("Unauthorized");
  }

  next();
}
