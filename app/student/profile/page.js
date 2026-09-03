"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";
const YEARS = ["1", "2", "3", "4", "5"];

function Avatar({ name }) {
  const initials = name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "S";
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white"
      style={{ background: "linear-gradient(135deg, #1e7e34, #48bb6e)" }}>
      {initials}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border-t pt-8 mt-8" style={{ borderColor: "var(--border)" }}>
      <h2 className="mb-5 text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function StudentProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ university: "", course: "", year_of_study: "", phone: "", location: "", bio: "" });
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError]     = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    // eslint-disable-next-line react-hooks/immutability
    loadProfile(token);
  }, [router]);

  const loadProfile = async (token) => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_URL}/students/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load profile");
      const student = data.student ?? data.data ?? {};
      setUser(data.user ?? student.user ?? null);
      setForm({
        university: student.university ?? "", course: student.course ?? "",
        year_of_study: student.year_of_study ?? "", phone: student.phone ?? "",
        location: student.location ?? "", bio: student.bio ?? "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      setSaving(true); setMessage(""); setError("");
      const res  = await fetch(`${API_URL}/students/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, year_of_study: Number(form.year_of_study) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container py-8 space-y-4">
        <div className="skeleton h-6 w-40" />
        <div className="card rounded-2xl p-8 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="skeleton h-20 w-20 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-5 w-48" />
              <div className="skeleton h-4 w-36" />
            </div>
          </div>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-12 w-full rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8 md:py-10">
      <div className="animate-fade-in">
        <span className="section-eyebrow">Account</span>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>My Profile</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Keep your academic and personal information up to date.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card mt-6 animate-fade-in rounded-2xl p-8">
          <div className="flex items-center gap-5">
            <Avatar name={user?.name} />
            <div>
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{user?.name || "Student"}</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{user?.email || ""}</p>
              {form.university && (
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  🎓 {form.course} · {form.university}
                </p>
              )}
            </div>
          </div>

          <Section title="Account Information">
            <div className="grid gap-4 sm:grid-cols-2">
              {[{ label: "Full Name", value: user?.name ?? "" }, { label: "Email Address", value: user?.email ?? "" }].map(({ label, value }) => (
                <div key={label}>
                  <label className="field-label">{label}</label>
                  <input type="text" value={value} disabled className="field-input" />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Academic Information">
            <div className="space-y-4">
              <div>
                <label className="field-label" htmlFor="university">University / College</label>
                <input id="university" type="text" name="university" value={form.university} onChange={handleChange}
                  placeholder="e.g. University of Dar es Salaam" className="field-input" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="course">Course / Programme</label>
                  <input id="course" type="text" name="course" value={form.course} onChange={handleChange}
                    placeholder="e.g. Computer Science" className="field-input" />
                </div>
                <div>
                  <label className="field-label" htmlFor="year_of_study">Year of Study</label>
                  <select id="year_of_study" name="year_of_study" value={form.year_of_study} onChange={handleChange} className="field-input">
                    <option value="">Select year</option>
                    {YEARS.map((y) => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Contact Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="e.g. 0712 345 678" className="field-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="location">Location</label>
                <input id="location" type="text" name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Dar es Salaam" className="field-input" />
              </div>
            </div>
          </Section>

          <Section title="About Me">
            <label className="field-label" htmlFor="bio">Bio</label>
            <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} rows={6}
              placeholder="Tell organisations about your skills, interests and career goals…" className="field-input resize-y" />
            <p className="mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>{form.bio.length} characters</p>
          </Section>

          {message && <div className="alert alert-success mt-6 animate-fade-in">{message}</div>}
          {error   && <div className="alert alert-error mt-6 animate-fade-in">{error}</div>}

          <div className="mt-8 flex justify-end">
            <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3-3-3-3v4a8 8 0 1 0 8 8h-4l3 3 3-3h-4a8 8 0 0 1-8 8z"/>
                  </svg>
                  Saving…
                </span>
              ) : "Save Profile"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
