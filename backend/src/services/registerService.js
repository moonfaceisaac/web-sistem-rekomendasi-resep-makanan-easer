import bcrypt from "bcrypt";

import { prisma } from "../config/prisma.js";

export async function registerService(data) {
  const {
    namaLengkap,

    username,

    tanggalLahir,

    tempatLahir,

    jenisKelamin,

    email,

    password,

    confirmPassword,
  } = data;

  if (password !== confirmPassword) {
    throw Error("Password mismatch");
  }

  const emailExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailExists) {
    throw Error("Email already exists");
  }

  const usernameExists = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (usernameExists) {
    throw Error("Username exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      namaLengkap,

      username,

      tanggalLahir: new Date(tanggalLahir),

      tempatLahir,

      jenisKelamin,

      email,

      password: hash,
    },
  });

  return {
    message: "Register success",

    user_id: user.user_id,
  };
}
