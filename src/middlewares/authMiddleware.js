import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies["token"];

  if (!token) {
    return res.status(401).json("No token provided");
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json("Invalid token");
    }
    console.log(decoded);

    req.user = decoded;
    if (req.user.role !== "Admin") {
      return res.status(403).json("Unauthorized");
    }
    next();
  });
}
