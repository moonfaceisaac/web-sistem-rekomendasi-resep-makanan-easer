import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma.js";

export async function register(data) {
  const res = await axios.post(
    "http://localhost:5000/auth/register",

    data,
  );

  return res.data;
}

export async function loginService({ username, password }) {
  let account = await prisma.user.findFirst({
    where: {
      OR: [{ email: username }, { username }],
    },
  });

  let type = "USER";

  if (!account) {
    account = await prisma.admin.findFirst({
      where: {
        OR: [{ email: username }, { username }],
      },
    });

    type = "ADMIN";
  }

  if (!account) {
    throw Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(
    password,

    account.password,
  );

  if (!valid) {
    throw Error("Invalid credentials");
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
    id: account.user_id ?? account.admin_id,
    accountType: type,
  };
}
