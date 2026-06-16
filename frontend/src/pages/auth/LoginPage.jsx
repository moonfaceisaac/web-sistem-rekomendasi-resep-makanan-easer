import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { getInteractionStatus } from "../../services/userService";
import { useAuthStore } from "../../store/authStore";
import { login } from "../../services/authService";
import { useToast } from "../../hooks/useToast";
import { getFriendlyApiError } from "../../utils/httpError";
import { isEmailIdentifier, isValidEmail } from "../../utils/validation";

export default function LoginPage() {
  const toast = useToast();
  const setHasInteraction = useAuthStore((s) => s.setHasInteraction);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    const identifier = form.identifier.trim();

    if (!identifier) {
      nextErrors.identifier = "Username or email is required.";
    } else if (isEmailIdentifier(identifier) && !isValidEmail(identifier)) {
      nextErrors.identifier = "Please enter a valid email format.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await login({
        username: form.identifier.trim(),
        password: form.password,
      });

      setAuth(res.token, res.username, res.accountType, res.id);
      toast.success("Login successful. Welcome back!");

      if (res.accountType === "ADMIN") {
        navigate("/admin");
      } else {
        const interaction = await getInteractionStatus();
        if (interaction.hasInteraction === false) {
          setHasInteraction(false);
          navigate("/onboarding");
        } else {
          setHasInteraction(true);
          navigate("/home");
        }
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 404) {
        setErrors((prev) => ({
          ...prev,
          identifier: message || "Username/email was not found.",
        }));
      } else if (status === 401) {
        setErrors((prev) => ({
          ...prev,
          password: message || "Password is incorrect.",
        }));
      } else if (status === 400 && message?.toLowerCase().includes("email")) {
        setErrors((prev) => ({
          ...prev,
          identifier: message,
        }));
      }

      toast.error(getFriendlyApiError(err, "Login failed"));
    } finally {
      setSubmitting(false);
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
            error={errors.identifier}
            disabled={submitting}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            disabled={submitting}
          />

          <Button type="submit" className="mt-1" loading={submitting}>
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
