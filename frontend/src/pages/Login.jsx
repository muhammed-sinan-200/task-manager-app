import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition duration-200 placeholder:text-stone-400 hover:border-stone-300 focus:border-[#4D7C0F] focus:ring-2 focus:ring-[#4D7C0F]/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-500";

  return (
    <AuthLayout
      imageSrc="/images/auth-login.webp"
      imageAlt="Task Manager workspace illustration"
    >
      <div
        className={`transition duration-500 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="mb-6 text-center md:mb-4 md:text-left">
          <p className="text-2xl font-semibold tracking-tight text-[#4D7C0F] md:text-sm md:tracking-wide">
            Task Manager
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl md:mt-1.5 dark:text-stone-100">
            Sign in
          </h1>
          <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">
            Welcome back. Continue where you left off.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_12px_40px_-24px_rgba(28,25,23,0.35)] sm:p-6 dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
              >
                {error}
              </p>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={`${inputClass} pr-11`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-stone-400 transition duration-200 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/30 dark:hover:text-stone-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff size={18} aria-hidden="true" />
                  ) : (
                    <FiEye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#4D7C0F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#3F680C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-stone-900"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-stone-500 dark:text-stone-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#4D7C0F] transition duration-200 hover:text-[#3F680C] hover:underline underline-offset-2"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
