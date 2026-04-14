import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { BookOpen, Loader } from "lucide-react";

const LoginPage = () => {
  const dispatch = useDispatch();

  const { isLoggingIn, authUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const res = await dispatch(login(formData));

    if (res.meta.requestStatus === "fulfilled") {
      const user = res.payload.user;
      if (!user.isApproved) return;
      if (user.role === "Admin") {
        navigate("/admin");
      } else if (user.role === "Teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    }
  };

  useEffect(() => {
    if (authUser) {
      switch (authUser.role) {
        case "Student":
          navigate("/student");
          break;
        case "Teacher":
          navigate("/teacher");
          break;
        case "Admin":
          navigate("/admin");
          break;
        default:
          navigate("/login");
      }
    }
  }, [authUser]);

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Educational Project Management
            </h1>
            <p className="text-slate-600 mt-2">Sign in to your account</p>
          </div>

          {/* login form  */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error.general}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={`input ${error.email ? "input-error" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {error.email && (
                  <p className="text-sm text-red-600 mt-1">{error.email}</p>
                )}
              </div>

              {/* password */}
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  name="password"
                  className={`input ${error.password ? "input-error" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                {error.password && (
                  <p className="text-sm text-red-600 mt-1">{error.password}</p>
                )}
              </div>

              {/* forgot password link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>

              {/* submit button */}
              <button
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoggingIn}
                type="submit">
                {isLoggingIn ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <a
                  href="/register"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold">
                  Sign Up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
