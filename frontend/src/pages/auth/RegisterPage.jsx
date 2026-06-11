// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AuthLayout from "../../components/layout/AuthLayout";
// import Input from "../../components/common/Input";
// import Button from "../../components/common/Button";
// import { register } from "../../services/authService";

// const INITIAL_FORM = {
//   fullname: "",
//   placeOfBirth: "",
//   username: "",
//   gender: "",
//   email: "",
//   password: "",
//   dateOfBirth: "",
//   confirmPassword: "",
// };

// // const submit = async (e) => {
// //   e.preventDefault();

// //   try {
// //     await register({
// //       namaLengkap,

// //       username,

// //       tanggalLahir,

// //       tempatLahir,

// //       jenisKelamin,

// //       email,

// //       password,

// //       confirmPassword,
// //     });

// //     alert("Register success");

// //     navigate("/login");
// //   } catch (err) {
// //     alert(err.response?.data?.message);
// //   }
// // };

// export default function RegisterPage() {
//   const [form, setForm] = useState(INITIAL_FORM);
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // TODO: authService.register(form)
//     navigate("/login");
//   };

//   return (
//     <AuthLayout title="Sign-Up" size="lg">
//       <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//         <div className="grid grid-cols-2 gap-3">
          // <Input
          //   type="text"
          //   name="fullname"
          //   placeholder="Fullname"
          //   value={form.fullname}
          //   onChange={handleChange}
          //   required
          // />
          // <Input
          //   type="text"
          //   name="placeOfBirth"
          //   placeholder="Place of Birth"
          //   value={form.placeOfBirth}
          //   onChange={handleChange}
          //   required
          // />
          // <Input
          //   type="text"
          //   name="username"
          //   placeholder="Username"
          //   value={form.username}
          //   onChange={handleChange}
          //   required
          // />
          // <select
          //   name="gender"
          //   value={form.gender}
          //   onChange={handleChange}
          //   required
          //   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          // >
          //   <option value="" disabled>
          //     Gender
          //   </option>
          //   <option value="male">Male</option>
          //   <option value="female">Female</option>
          // </select>
          // <Input
          //   type="email"
          //   name="email"
          //   placeholder="E-Mail"
          //   value={form.email}
          //   onChange={handleChange}
          //   required
          // />
          // <Input
          //   type="password"
          //   name="password"
          //   placeholder="Password"
          //   value={form.password}
          //   onChange={handleChange}
          //   required
          // />
          // <Input
          //   type="date"
          //   name="dateOfBirth"
          //   value={form.dateOfBirth}
          //   onChange={handleChange}
          //   required
          // />
          // <Input
          //   type="password"
          //   name="confirmPassword"
          //   placeholder="Confirm Password"
          //   value={form.confirmPassword}
          //   onChange={handleChange}
          //   required
          // />
//         </div>
//         <Button type="submit" className="mt-1" onSubmit={submit}>
//           Sign-Up
//         </Button>
//       </form>
//       <p className="text-center text-sm text-gray-500 mt-4">
//         Already have an account?{" "}
//         <Link
//           to="/login"
//           className="font-semibold text-gray-900 hover:underline"
//         >
//           Sign-In
//         </Link>
//       </p>
//     </AuthLayout>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import { register } from "../../services/authService";

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
  const [form, setForm] = useState(INITIAL_FORM);

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
      await register({
        namaLengkap: form.fullname,

        username: form.username,

        tanggalLahir: form.dateOfBirth,

        tempatLahir: form.placeOfBirth,

        jenisKelamin: form.gender.toUpperCase(),

        email: form.email,

        password: form.password,

        confirmPassword: form.confirmPassword,
      });

      alert("Register success");

      navigate("/logout");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
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
            required
          />
          <Input
            type="text"
            name="placeOfBirth"
            placeholder="Place of Birth"
            value={form.placeOfBirth}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="" disabled>
              Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <Input
            type="email"
            name="email"
            placeholder="E-Mail"
            value={form.email}
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
          <Input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="mt-1">
          Sign-Up
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?
        <Link
          to="/logout"
          className="font-semibold text-gray-900 hover:underline"
        >
          Sign-In
        </Link>
      </p>
    </AuthLayout>
  );
}
