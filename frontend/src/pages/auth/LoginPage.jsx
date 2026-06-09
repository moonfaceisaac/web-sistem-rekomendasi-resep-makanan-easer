import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { getInteractionStatus } from "../../services/userService";
import { useAuthStore } from "../../store/authStore";
import { login } from "../../services/authService";



export default function LoginPage() {
  const setHasInteraction = useAuthStore((s) => s.setHasInteraction)
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({
    identifier: "",

    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({
        username: form.identifier,

        password: form.password,
      });

      setAuth(
        res.token,
        res.accountType,
        res.id
      )

      if (res.accountType === "ADMIN") {
        navigate("/admin");
      } else {
        const interaction = await getInteractionStatus();
        if (interaction.hasInteraction === false) {
          setHasInteraction(false);
          navigate("/onboarding");
        } else {
          setHasInteraction(true);
          navigate("/home")
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout title="Sign-In">
      <div className="max-w-sm mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="text"
            name="identifier"
            placeholder="Username / E-mail"
            value={form.identifier}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="mt-1">
            Sign-In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?
          <Link
            to="/register"
            className="font-semibold text-gray-900 hover:underline"
          >
            Sign-Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
