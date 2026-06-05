import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.sendStatus(401);
  }

  try {
    req.user = jwt.verify(
      header.split(" ")[1],

      process.env.JWT_SECRET,
    );

    next();
  } catch {
    return res.sendStatus(401);
  }
}
