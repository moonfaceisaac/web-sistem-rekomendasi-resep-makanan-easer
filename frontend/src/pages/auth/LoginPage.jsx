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

  // return (
  //   <AuthLayout title="Sign-In">
  //     <div className="max-w-sm mx-auto">
  //       <form onSubmit={handleSubmit} className="flex flex-col gap-3">
  //         <Input
  //           type="text"
  //           name="identifier"
  //           placeholder="Username / E-mail"
  //           value={form.identifier}
  //           onChange={handleChange}
  //           error={errors.identifier}
  //           disabled={submitting}
  //         />

  //         <Input
  //           type="password"
  //           name="password"
  //           placeholder="Password"
  //           value={form.password}
  //           onChange={handleChange}
  //           error={errors.password}
  //           disabled={submitting}
  //         />

  //         <Button type="submit" className="mt-1" loading={submitting}>
  //           Sign-In
  //         </Button>
  //       </form>

  //       <p className="text-center text-sm text-gray-500 mt-4">
  //         Don't have an account?
  //         <Link
  //           to="/register"
  //           className="font-semibold text-gray-900 hover:underline"
  //         >
  //           Sign-Up
  //         </Link>
  //       </p>
  //     </div>
  //   </AuthLayout>
  // );
  return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Pane: Introduction */}
          <div className="flex flex-col gap-4 text-left md:pr-8 lg:pr-16 order-2 md:order-1">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              HELLO DEAR VISITORS!
            </h1>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-wide">
              WELCOME TO ERR.
            </h2>
            
            <p className="text-gray-600 leading-relaxed text-sm">
              ERR is a web-based food recipe recommender that acts like a matchmaker for your tastebuds using a collaborative approach utilizing the <span className="font-semibold text-gray-900">EASE-R</span> model.
            </p>
            
            <p className="text-gray-600 leading-relaxed text-sm">
              What does that mean? It means we look at what recipes you and thousands of other food lovers have interacted with in the same recipe database. By taking everyone's collective hints like ratings and bookmarks, our trained EASE-R model connects the dots. It basically figures out, <span className="italic font-medium text-gray-800">"Hey, people who love the exact same food as you also obsessed over this specific dish."</span>
            </p>
            
            <p className="text-gray-600 leading-relaxed text-sm">
              It takes all that data and serves up a list of recommended recipes that might just be the culinary soulmates you've been looking for all your life.
            </p>
  
            <div className="flex flex-col gap-1 text-xs text-gray-500 mt-2">
              <p>
                Want to nerd out over the math and see how the EASE-R model works under the hood? Check out the{" "}
                <a 
                  href="https://arxiv.org/abs/1905.03375" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-900 hover:underline"
                >
                  official paper here
                </a>.
              </p>
              <p>
                Curious about the recipe database behind the app? Check out this{" "}
                <a 
                  href="https://www.kaggle.com/code/kerneler/starter-foodrecsys-v1-68b0e739-9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-900 hover:underline"
                >
                  recipe database
                </a>.
              </p>
            </div>
  
            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
              Found a bug or broke something? Let us know here:{" "}
              <a href="mailto:7zyplock@gmail.com" className="font-medium text-gray-600 hover:underline">
                7zyplock@gmail.com
              </a>
            </div>
          </div>
  
          {/* Right Pane: Custom Card layout using AuthLayout */}
          <div className="w-full order-1 md:order-2">
            <AuthLayout title="Sign-In">
              <div className="w-full max-w-sm mx-auto">
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
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-gray-900 hover:underline"
                  >
                    Sign-Up
                  </Link>
                </p>
              </div>
            </AuthLayout>
          </div>
  
        </div>
      </div>
    );
}
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import AuthLayout from "../../components/layout/AuthLayout";
// import Input from "../../components/common/Input";
// import Button from "../../components/common/Button";
// import { getInteractionStatus } from "../../services/userService";
// import { useAuthStore } from "../../store/authStore";
// import { login } from "../../services/authService";
// import { useToast } from "../../hooks/useToast";
// import { getFriendlyApiError } from "../../utils/httpError";
// import { isEmailIdentifier, isValidEmail } from "../../utils/validation";

// export default function LoginPage() {
//   const toast = useToast();
//   const setHasInteraction = useAuthStore((s) => s.setHasInteraction);
//   const setAuth = useAuthStore((s) => s.setAuth);
//   const [form, setForm] = useState({
//     identifier: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validate = () => {
//     const nextErrors = {};
//     const identifier = form.identifier.trim();

//     if (!identifier) {
//       nextErrors.identifier = "Username or email is required.";
//     } else if (isEmailIdentifier(identifier) && !isValidEmail(identifier)) {
//       nextErrors.identifier = "Please enter a valid email format.";
//     }

//     if (!form.password.trim()) {
//       nextErrors.password = "Password is required.";
//     }

//     setErrors(nextErrors);

//     return Object.keys(nextErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate() || submitting) {
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const res = await login({
//         username: form.identifier.trim(),
//         password: form.password,
//       });

//       setAuth(res.token, res.username, res.accountType, res.id);
//       toast.success("Login successful. Welcome back!");

//       if (res.accountType === "ADMIN") {
//         navigate("/admin");
//       } else {
//         const interaction = await getInteractionStatus();
//         if (interaction.hasInteraction === false) {
//           setHasInteraction(false);
//           navigate("/onboarding");
//         } else {
//           setHasInteraction(true);
//           navigate("/home");
//         }
//       }
//     } catch (err) {
//       const status = err.response?.status;
//       const message = err.response?.data?.message;

//       if (status === 404) {
//         setErrors((prev) => ({
//           ...prev,
//           identifier: message || "Username/email was not found.",
//         }));
//       } else if (status === 401) {
//         setErrors((prev) => ({
//           ...prev,
//           password: message || "Password is incorrect.",
//         }));
//       } else if (status === 400 && message?.toLowerCase().includes("email")) {
//         setErrors((prev) => ({
//           ...prev,
//           identifier: message,
//         }));
//       }

//       toast.error(getFriendlyApiError(err, "Login failed"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-12">
//       <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
        
//         {/* Left Pane: Introduction */}
//         <div className="flex flex-col gap-4 text-left md:pr-8 lg:pr-16 order-2 md:order-1">
//           <h1 className="text-xl font-bold tracking-tight text-gray-900">
//             HELLO DEAR VISITORS!
//           </h1>
//           <h2 className="text-2xl font-extrabold text-gray-900 tracking-wide">
//             WELCOME TO ERR.
//           </h2>
          
//           <p className="text-gray-600 leading-relaxed text-sm">
//             ERR is a web-based food recipe recommender that acts like a matchmaker for your tastebuds using a collaborative approach utilizing the <span className="font-semibold text-gray-900">EASE-R</span> model.
//           </p>
          
//           <p className="text-gray-600 leading-relaxed text-sm">
//             What does that mean? It means we look at what you and thousands of other food lovers are doing on the app. By taking everyone's collective hints—like ratings and bookmarks—our trained EASE-R model connects the dots. It basically figures out, <span className="italic font-medium text-gray-800">"Hey, people who love the exact same food as you also obsessed over this specific dish."</span>
//           </p>
          
//           <p className="text-gray-600 leading-relaxed text-sm">
//             It takes all that data and serves up recipe recommendations that might just be the culinary soulmates you’ve been looking for all your life.
//           </p>

//           <div className="flex flex-col gap-1 text-xs text-gray-500 mt-2">
//             <p>
//               Want to nerd out over the math and see how the EASE-R model works under the hood? Check out the{" "}
//               <a 
//                 href="https://arxiv.org/abs/1905.03375" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="font-semibold text-gray-900 hover:underline"
//               >
//                 official paper here
//               </a>.
//             </p>
//             <p>
//               Curious about the ingredients behind the app? Check out our{" "}
//               <a 
//                 href="https://www.kaggle.com/code/kerneler/starter-foodrecsys-v1-68b0e739-9" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="font-semibold text-gray-900 hover:underline"
//               >
//                 recipe database
//               </a>.
//             </p>
//           </div>

//           <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
//             Found a bug or broke something? Let us know here:{" "}
//             <a href="mailto:7zyplock@gmail.com" className="font-medium text-gray-600 hover:underline">
//               7zyplock@gmail.com
//             </a>
//           </div>
//         </div>

//         {/* Right Pane: Custom Card layout using AuthLayout */}
//         <div className="w-full order-1 md:order-2">
//           <AuthLayout title="Sign-In">
//             <div className="w-full max-w-sm mx-auto">
//               <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//                 <Input
//                   type="text"
//                   name="identifier"
//                   placeholder="Username / E-mail"
//                   value={form.identifier}
//                   onChange={handleChange}
//                   error={errors.identifier}
//                   disabled={submitting}
//                 />

//                 <Input
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   value={form.password}
//                   onChange={handleChange}
//                   error={errors.password}
//                   disabled={submitting}
//                 />

//                 <Button type="submit" className="mt-1" loading={submitting}>
//                   Sign-In
//                 </Button>
//               </form>

//               <p className="text-center text-sm text-gray-500 mt-4">
//                 Don't have an account?{" "}
//                 <Link
//                   to="/register"
//                   className="font-semibold text-gray-900 hover:underline"
//                 >
//                   Sign-Up
//                 </Link>
//               </p>
//             </div>
//           </AuthLayout>
//         </div>

//       </div>
//     </div>
//   );
// }


