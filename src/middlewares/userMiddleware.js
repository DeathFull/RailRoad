export function userMiddleware(req, res, next) {
  if (req.params.id !== req.user._id.toString()) {
    return res.status(403).send("Unauthorized");
  }

  next();
}
