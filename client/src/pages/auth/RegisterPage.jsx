import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BookOpen, Loader } from "lucide-react";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error[e.target.name]) {
      setError({ ...error, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 characters required";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const res = await dispatch(register(formData));

    setIsLoading(false);

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Registration successful!");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Educational Project Management
          </h1>

          <p className="text-slate-600 mt-2">
            Create your account to get started
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                name="name"
                className={`input ${error.name ? "input-error" : ""}`}
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
              {error.name && (
                <p className="text-sm text-red-600 mt-1">{error.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                className={`input ${error.email ? "input-error" : ""}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {error.email && (
                <p className="text-sm text-red-600 mt-1">{error.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                className={`input ${error.password ? "input-error" : ""}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {error.password && (
                <p className="text-sm text-red-600 mt-1">{error.password}</p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Loader className="animate-spin mr-2 h-5 w-5" />
                  Registering...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Footer */}
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
