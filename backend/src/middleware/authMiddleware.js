import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);

    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.accountType !== "ADMIN") {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  next();
}
