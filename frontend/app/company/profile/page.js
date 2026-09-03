"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

function Section({ title, children }) {
  return (
    <div className="border-t pt-8 mt-8" style={{ borderColor: "var(--border)" }}>
      <h2 className="mb-5 text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      {children}
    </div>
  );
}

function CompanyAvatar({ name }) {
  const initials = name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "CO";
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white"
      style={{ background: "linear-gradient(135deg, #7c5c00, #e0a800)" }}>
      {initials}
    </div>
  );
}

export default function CompanyProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ company_name: "", description: "", phone: "", location: "", website: "" });
  const [user, setUser]       = useState(null);
  const [company, setCompany] = useState(null);
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
      const res  = await fetch(`${API_URL}/companies/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load profile");
      const co = data.company ?? data.data ?? {};
      setCompany(co);
      setUser(data.user ?? co.user ?? null);
      setForm({ company_name: co.company_name ?? "", description: co.description ?? "", phone: co.phone ?? "", location: co.location ?? "", website: co.website ?? "" });
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
      const res  = await fetch(`${API_URL}/companies/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      setMessage("Company profile updated successfully!");
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
          <div className="flex gap-4">
            <div className="skeleton h-20 w-20 rounded-2xl" />
            <div className="flex-1 space-y-2"><div className="skeleton h-5 w-48" /><div className="skeleton h-4 w-36" /></div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-12 w-full rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8 md:py-10">
      <div className="animate-fade-in">
        <span className="section-eyebrow">Organisation</span>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Company Profile</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Keep your organisation details up to date so students can learn about you.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card mt-6 animate-fade-in rounded-2xl p-8">
          <div className="flex items-center gap-5">
            <CompanyAvatar name={form.company_name || user?.name} />
            <div>
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{form.company_name || user?.name || "Your Organisation"}</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{user?.email || ""}</p>
              {form.location && <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>📍 {form.location}</p>}
              {Number(company?.is_verified) === 1
                ? <span className="badge badge-green mt-2">✓ Verified</span>
                : <span className="badge badge-yellow mt-2">⏳ Pending Verification</span>}
            </div>
          </div>

          <Section title="Account Information">
            <div className="grid gap-4 sm:grid-cols-2">
              {[{ label: "Account Name", value: user?.name ?? "" }, { label: "Email Address", value: user?.email ?? "" }].map(({ label, value }) => (
                <div key={label}><label className="field-label">{label}</label><input type="text" value={value} disabled className="field-input" /></div>
              ))}
            </div>
          </Section>

          <Section title="Organisation Details">
            <div className="space-y-4">
              <div>
                <label className="field-label" htmlFor="company_name">Company / Organisation Name</label>
                <input id="company_name" type="text" name="company_name" value={form.company_name} onChange={handleChange}
                  placeholder="e.g. ABC Technologies Ltd" required className="field-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="description">Description</label>
                <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={6}
                  placeholder="Tell students about your organisation, mission and culture…" className="field-input resize-y" />
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{form.description.length} characters</p>
              </div>
            </div>
          </Section>

          <Section title="Contact Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0712 345 678" className="field-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="location">Location</label>
                <input id="location" type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Dar es Salaam" className="field-input" />
              </div>
            </div>
          </Section>

          <Section title="Online Presence">
            <div>
              <label className="field-label" htmlFor="website">Website URL</label>
              <input id="website" type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://example.com" className="field-input" />
            </div>
          </Section>

          {message && <div className="alert alert-success mt-6 animate-fade-in">{message}</div>}
          {error   && <div className="alert alert-error mt-6 animate-fade-in">{error}</div>}

          <div className="mt-8 flex justify-end">
            <button type="submit" disabled={saving} className="btn btn-lg" style={{ background: "var(--brand-600)", color: "#fff" }}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3-3-3-3v4a8 8 0 1 0 8 8h-4l3 3 3-3h-4a8 8 0 0 1-8 8z"/>
                  </svg>
                  Saving…
                </span>
              ) : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
