"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?.role === "company") router.push("/company/dashboard");
      else if (data.user?.role === "admin") router.push("/admin/dashboard");
      else router.push("/student/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--background)" }}>

      {/* ── Left panel — branding ────────────────── */}
      <div
        className="hidden flex-col justify-between p-12 text-white lg:flex lg:w-2/5"
        style={{ background: "linear-gradient(160deg, #1e7e34 0%, #28a745 60%, #48bb6e 100%)" }}
      >
        <Link href="/">
          <img src="/logo.png" alt="FieldConnect" className="h-12 w-auto" />
        </Link>

        <div>
          <blockquote className="text-3xl font-bold leading-snug">
            "The right opportunity can change the course of your career."
          </blockquote>
          <p className="mt-4 text-sm" style={{ color: "#a7f3c0" }}>
            Thousands of students have found their field placement through FieldConnect.
          </p>

          {/* Feature dots */}
          <ul className="mt-10 space-y-3">
            {[
              "Browse 500+ verified opportunities",
              "Apply with a single cover letter",
              "Real-time application tracking",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs" style={{ color: "#a7f3c0" }}>© 2026 FieldConnect</p>
      </div>

      {/* ── Right panel — form ───────────────────── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">

          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/">
              <img src="/logo.png" alt="FieldConnect" className="h-12 w-auto" />
            </Link>
          </div>

          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Welcome back
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Log in to continue to your account
          </p>

          {error && (
            <div className="alert alert-error mt-6 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="field-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="field-input"
              />
            </div>

            {/* Password */}
            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="field-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: "var(--text-muted)" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3-3-3-3v4a8 8 0 1 0 8 8h-4l3 3 3-3h-4a8 8 0 0 1-8 8z" />
                  </svg>
                  Logging in…
                </span>
              ) : "Log In"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold" style={{ color: "var(--brand-600)" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
