/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Account created! Redirecting to login…");
      setFormData({ name: "", email: "", password: "", role: "student" });

      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: "student",
      icon: "🎓",
      title: "Student",
      description: "Find field training & internships",
    },
    {
      value: "company",
      icon: "🏢",
      title: "Organization",
      description: "Post opportunities & hire",
    },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--background)" }}>

      {/* ── Left panel — branding ────────────────── */}
      <div
        className="hidden flex-col justify-between p-12 text-white lg:flex lg:w-2/5"
        style={{ background: "linear-gradient(160deg, #1e7e34 0%, #28a745 60%, #48bb6e 100%)" }}
      >
        <Link href="/" className="flex items-center"><img src="/logo.png" alt="FieldConnect" className="h-10 w-auto" /></Link>

        <div>
          <h2 className="text-3xl font-bold leading-snug">
            Join the community of students building real careers.
          </h2>
          <p className="mt-4 text-sm leading-6" style={{ color: "#a7f3c0" }}>
            Create your free account, complete your profile, and start applying
            to field placements and internships today.
          </p>

          <ul className="mt-10 space-y-3">
            {[
              "Free for students, always",
              "Direct contact with organizations",
              "Track every application",
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
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">

          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/">
              <img src="/logo.png" alt="FieldConnect" className="h-12 w-auto" />
            </Link>
          </div>

          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Create your account
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Get started with FieldConnect for free
          </p>

          {error && (
            <div className="alert alert-error mt-6 animate-fade-in">{error}</div>
          )}
          {success && (
            <div className="alert alert-success mt-6 animate-fade-in">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* Role selection */}
            <div>
              <label className="field-label">I am registering as</label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                {roles.map(({ value, icon, title, description }) => {
                  const active = formData.role === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, role: value }))}
                      className="relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-5 text-center transition"
                      style={{
                        borderColor: active ? "var(--brand-600)" : "var(--border)",
                        background: active ? "var(--brand-50)" : "var(--surface)",
                        boxShadow: active ? "0 0 0 3px rgba(40,167,69,0.12)" : "none",
                      }}
                    >
                      {active && (
                        <span
                          className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
                          style={{ background: "var(--brand-600)" }}
                        >
                          ✓
                        </span>
                      )}
                      <span className="text-3xl">{icon}</span>
                      <span className="font-semibold text-sm" style={{ color: active ? "var(--brand-700)" : "var(--text-primary)" }}>
                        {title}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="field-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                autoComplete="name"
                className="field-input"
              />
            </div>

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
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                  autoComplete="new-password"
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
                  Creating account…
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold" style={{ color: "var(--brand-600)" }}>
              Log in
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
