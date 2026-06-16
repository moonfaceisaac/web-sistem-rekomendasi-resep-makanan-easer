import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import { register } from "../../services/authService";
import { useToast } from "../../hooks/useToast";
import { getFriendlyApiError } from "../../utils/httpError";
import { isValidEmail } from "../../utils/validation";

const INITIAL_FORM = {
  fullname: "",
  placeOfBirth: "",
  username: "",
  gender: "",
  email: "",
  password: "",
  dateOfBirth: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const toast = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullname.trim()) nextErrors.fullname = "Fullname is required.";
    if (!form.placeOfBirth.trim()) {
      nextErrors.placeOfBirth = "Place of birth is required.";
    }
    if (!form.username.trim()) nextErrors.username = "Username is required.";
    if (!form.gender) nextErrors.gender = "Gender is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = "Please enter a valid email format.";
    }
    if (!form.password.trim()) nextErrors.password = "Password is required.";
    if (!form.dateOfBirth)
      nextErrors.dateOfBirth = "Date of birth is required.";
    if (!form.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm password is required.";
    }

    if (
      form.password.trim() &&
      form.confirmPassword.trim() &&
      form.password !== form.confirmPassword
    ) {
      nextErrors.confirmPassword = "Password and confirm password must match.";
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
      await register({
        namaLengkap: form.fullname.trim(),
        username: form.username.trim(),
        tanggalLahir: form.dateOfBirth,
        tempatLahir: form.placeOfBirth.trim(),
        jenisKelamin: form.gender.toUpperCase(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      toast.success("Registration successful. Please sign in.");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "";
      const lowered = message.toLowerCase();

      if (lowered.includes("username")) {
        setErrors((prev) => ({ ...prev, username: message }));
      }
      if (lowered.includes("email")) {
        setErrors((prev) => ({ ...prev, email: message }));
      }
      if (lowered.includes("password") && lowered.includes("match")) {
        setErrors((prev) => ({ ...prev, confirmPassword: message }));
      }

      toast.error(getFriendlyApiError(err, "Register failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Sign-Up" size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="text"
            name="fullname"
            placeholder="Fullname"
            value={form.fullname}
            onChange={handleChange}
            error={errors.fullname}
            disabled={submitting}
          />
          <Input
            type="text"
            name="placeOfBirth"
            placeholder="Place of Birth"
            value={form.placeOfBirth}
            onChange={handleChange}
            error={errors.placeOfBirth}
            disabled={submitting}
          />
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            disabled={submitting}
          />
          <div>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={submitting}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 ${errors.gender ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-gray-400"}`}
            >
              <option value="" disabled>
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-600 mt-1">{errors.gender}</p>
            )}
          </div>
          <Input
            type="email"
            name="email"
            placeholder="E-Mail"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
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
          <Input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
            disabled={submitting}
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={submitting}
          />
        </div>

        <Button type="submit" className="mt-1" loading={submitting}>
          Sign-Up
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?
        <Link
          to="/login"
          className="font-semibold text-gray-900 hover:underline"
        >
          Sign-In
        </Link>
      </p>
    </AuthLayout>
  );
}
