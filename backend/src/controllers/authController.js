import { registerService } from "../services/registerService.js";
import { loginService } from "../services/authService.js";

export async function register(req, res) {
  try {
    const result = await registerService(req.body);

    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 400).json({
      message: err.message,
    });
  }
}

export async function login(req, res) {
  try {
    const result = await loginService(req.body);

    res.json(result);
  } catch (err) {
    res.status(err.status || 401).json({
      message: err.message || "Invalid credentials",
    });
  }
}
