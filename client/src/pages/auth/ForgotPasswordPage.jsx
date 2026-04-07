import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { KeyRound, Loader } from "lucide-react";
import { forgotPassword } from "../../store/slices/authSlice";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState("");
  const [error, setError] = useState("");
  const { isRequestingForToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return;
    }

    setError("");
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setIsSubmitted(true);
    } catch (error) {
      setError(error || "Failed to send reset password link");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        
        {/* Icon */}
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100">
          <svg
            className="w-7 h-7 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 7.5l-9 9M9 7.5h7.5v7.5"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Check your email
        </h2>

        {/* Message */}
        <p className="text-slate-600 text-sm mb-4">
          A password reset link has been sent to{" "}
          <span className="font-medium text-slate-800">{email}</span>.
        </p>

        <p className="text-slate-500 text-sm mb-6">
          If you don’t see the email, check your spam folder.
        </p>

        {/* Back to login */}
        <Link
          to="/login"
          className="inline-block text-blue-600 font-medium hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Forgot Password?
            </h1>
            <p className="text-slate-600 mt-2">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Forgot password form  */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={`input ${error ? "input-error" : ""}`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your email"
                  disabled={isRequestingForToken}
                />
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
              </div>

              {/* submit button */}
              <button
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isRequestingForToken}
                type="submit">
                {isRequestingForToken ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Sending...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
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
  );
};

export default ForgotPasswordPage;
