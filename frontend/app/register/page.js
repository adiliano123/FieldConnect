"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (formData.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, role: formData.role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => router.push("/login"), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "student", icon: "🎓", title: "Student",      description: "Find field training & internships" },
    { value: "company", icon: "🏢", title: "Organisation",  description: "Post opportunities & hire"         },
  ];

  return (
    /* eslint-disable @next/next/no-img-element */
    <div className="flex min-h-full">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 text-white"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 55%, #155724 100%)" }}>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ffc107" }}>
            Join FieldConnect
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold leading-snug">
            Join the community of students building real careers.
          </h2>
          <p className="mt-3 text-sm leading-6" style={{ color: "rgba(255,255,255,0.6)" }}>
            Create your free account and start applying to field placements today.
          </p>
          <ul className="mt-6 space-y-2.5">
            {[
              { icon: "🎓", text: "Free for students, always"     },
              { icon: "📋", text: "500+ active opportunities"     },
              { icon: "🔔", text: "Real-time notifications"       },
              { icon: "💰", text: "Secure placement fee payment"  },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: "rgba(255,193,7,0.15)" }}>{icon}</span>
                <span style={{ color: "rgba(255,255,255,0.75)" }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>© 2026 FieldConnect</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-6"
        style={{ background: "var(--background)" }}>
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile logo */}
          <div className="mb-4 flex justify-center lg:hidden">
            <Link href="/"><img src="/icon.png" alt="FieldConnect" className="h-9 w-auto" /></Link>
          </div>

          {/* Heading */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Create your account</h1>
              <p className="mt-0.5 text-sm" style={{ color: "var(--text-secondary)" }}>Get started for free</p>
            </div>
            <Link href="/" className="text-sm hover:underline shrink-0 mt-1" style={{ color: "var(--brand-600)" }}>
              ← Home
            </Link>
          </div>

          {error   && <div className="alert alert-error mb-3 animate-fade-in">{error}</div>}
          {success && <div className="alert alert-success mb-3 animate-fade-in">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Role cards */}
            <div>
              <label className="field-label text-xs">I am registering as</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {roles.map(({ value, icon, title, description }) => {
                  const active = formData.role === value;
                  return (
                    <button key={value} type="button"
                      onClick={() => setFormData((p) => ({ ...p, role: value }))}
                      className="relative flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 transition"
                      style={{
                        borderColor: active ? "var(--brand-600)" : "var(--border)",
                        background:  active ? "var(--brand-50)"  : "var(--surface)",
                        boxShadow:   active ? "0 0 0 3px rgba(40,167,69,0.1)" : "none",
                      }}>
                      {active && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] text-white"
                          style={{ background: "var(--brand-600)" }}>✓</span>
                      )}
                      <span className="text-lg">{icon}</span>
                      <div className="text-left">
                        <p className="text-xs font-bold"
                          style={{ color: active ? "var(--brand-700)" : "var(--text-primary)" }}>{title}</p>
                        <p className="text-[10px] leading-3" style={{ color: "var(--text-muted)" }}>{description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="field-label" htmlFor="name">
                {formData.role === "company" ? "Organisation Name" : "Full Name"}
              </label>
              <input id="name" type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder={formData.role === "company" ? "e.g. ABC Technologies Ltd" : "Enter your full name"}
                required autoComplete="name" className="field-input" />
            </div>

            {/* Email */}
            <div>
              <label className="field-label" htmlFor="email">Email Address</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@example.com" required autoComplete="email" className="field-input" />
            </div>

            {/* Password */}
            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="At least 6 characters" minLength={6} required
                  autoComplete="new-password" className="field-input pr-14" />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3-3-3-3v4a8 8 0 1 0 8 8h-4l3 3 3-3h-4a8 8 0 0 1-8 8z"/>
                  </svg>
                  Creating…
                </span>
              ) : `Create ${formData.role === "company" ? "Organisation" : "Student"} Account`}
            </button>
          </form>

          <p className="mt-3 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold" style={{ color: "var(--brand-600)" }}>Log in</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
