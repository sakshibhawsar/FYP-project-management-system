import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { KeyRound, Loader } from "lucide-react";
import { resetPassword } from "../../store/slices/authSlice";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUpdatingPassword } = useSelector((state) => state.auth);

  const token = searchParams.get("token");

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
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword.length < 8) {
      newErrors.confirmPassword =
        "Confirm Password must be at least 8 characters";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      ).unwrap();

      navigate("/login");
    } catch (error) {
      setError({
        general: error || "Failed to reset password. Please try again.",
      })
    }
  };

  return   <>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
             Reset Password
            </h1>
            <p className="text-slate-600 mt-2">Enter your new password below.</p>
          </div>

          {/* Reset Password form  */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error.general}</p>
                </div>
              )}

              {/* new password */}
              <div>
                <label className="label">New Password</label>
                <input
                  type="password"
                  name="password"
                  className={`input ${error.password ? "input-error" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                />
                {error.password && (
                  <p className="text-sm text-red-600 mt-1">{error.password}</p>
                )}
              </div>

              {/* password */}
              <div>
                <label className="label">confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`input ${error.password ? "input-error" : ""}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter your confirm Password"
                />
                {error.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{error.confirmPassword}</p>
                )}
              </div>


              {/* submit button */}
              <button
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdatingPassword}
                type="submit">
               {
                  isUpdatingPassword ? (
                    <div className="flex items-center justify-center">
                      <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"/>
                      Reseting...
                    </div>
                  ):"Reset Password"
               }
              </button>
            </form>
             <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Remember your password?{" "}
                <Link to={"/login"} className="text-blue-500 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
};

export default ResetPasswordPage;
