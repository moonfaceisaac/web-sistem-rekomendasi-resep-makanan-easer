import axios from "axios";

const API = "http://localhost:5000";

export async function register(data) {
  const res = await axios.post(
    `${API}/auth/register`,

    data,
  );

  return res.data;
}

export async function login(data) {
  const res = await axios.post(
    `${API}/auth/login`,

    data,
  );

  return res.data;
}
