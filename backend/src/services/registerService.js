import bcrypt from "bcrypt";

import { prisma } from "../config/prisma.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

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

  if (!String(namaLengkap || "").trim()) {
    throw buildError(400, "Fullname is required");
  }

  if (!String(tempatLahir || "").trim()) {
    throw buildError(400, "Place of birth is required");
  }

  if (!String(username || "").trim()) {
    throw buildError(400, "Username is required");
  }

  if (!String(email || "").trim()) {
    throw buildError(400, "Email is required");
  }

  if (!isValidEmail(String(email).trim())) {
    throw buildError(400, "Invalid email format");
  }

  if (!String(password || "")) {
    throw buildError(400, "Password is required");
  }

  if (!String(confirmPassword || "")) {
    throw buildError(400, "Confirm password is required");
  }

  if (password !== confirmPassword) {
    throw buildError(400, "Password mismatch");
  }

  const emailExists = await prisma.user.findUnique({
    where: {
      email: String(email).trim(),
    },
  });

  if (emailExists) {
    throw buildError(409, "Email already exists");
  }

  const usernameExists = await prisma.user.findFirst({
    where: {
      username: String(username).trim(),
    },
  });

  if (usernameExists) {
    throw buildError(409, "Username already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      namaLengkap: String(namaLengkap).trim(),
      username: String(username).trim(),
      tanggalLahir: new Date(tanggalLahir),
      tempatLahir: String(tempatLahir).trim(),
      jenisKelamin,
      email: String(email).trim(),
      password: hash,
    },
  });

  return {
    message: "Register success",
    user_id: user.user_id,
  };
}
