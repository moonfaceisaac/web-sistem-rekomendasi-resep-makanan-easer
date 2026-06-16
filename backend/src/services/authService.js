import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export async function loginService({ username, password }) {
  const identifier = String(username || "").trim();
  const normalizedPassword = String(password || "");

  if (!identifier) {
    throw buildError(400, "Username or email is required");
  }

  if (!normalizedPassword) {
    throw buildError(400, "Password is required");
  }

  if (identifier.includes("@") && !isValidEmail(identifier)) {
    throw buildError(400, "Invalid email format");
  }

  let account = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  let type = "USER";

  if (!account) {
    account = await prisma.admin.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    type = "ADMIN";
  }

  if (!account) {
    throw buildError(404, "Username/email not found");
  }

  const valid = await bcrypt.compare(normalizedPassword, account.password);

  if (!valid) {
    throw buildError(401, "Password incorrect");
  }

  const token = jwt.sign(
    {
      accountType: type,
      id: account.user_id ?? account.admin_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    username: account.username,
    id: account.user_id ?? account.admin_id,
    accountType: type,
  };
}
