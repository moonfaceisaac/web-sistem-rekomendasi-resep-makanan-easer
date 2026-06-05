import { registerService } from "../services/registerService.js";

export async function register(req, res) {
  try {
    const result = await registerService(req.body);

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}

import { loginService } from "../services/authService.js";

export async function login(req, res) {
  try {
    const result = await loginService(req.body);

    res.json(result);
  } catch {
    res.status(401).json({
      message: "Invalid",
    });
  }
}
