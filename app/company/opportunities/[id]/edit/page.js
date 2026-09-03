"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://localhost:5000/api";

function Section({ title, desc, children }) {
  return (
    <div className="border-t pt-8 mt-8" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      {desc && <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{desc}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

const TYPES = [
  { value: "field",      icon: "🌿", label: "Field"      },
  { value: "internship", icon: "💼", label: "Internship" },
  { value: "attachment", icon: "📎", label: "Attachment" },
  { value: "volunteer",  icon: "🤝", label: "Volunteer"  },
];

export default function EditOpportunityPage() {
  const { id } = useParams();
  const router  = useRouter();

  const [form, setForm] = useState({
    title: "", description: "", type: "field", category: "",
    location: "", requirements: "", positions: 1, deadline: "", status: "open",
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchOpportunity(token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOpportunity = async (token) => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_URL}/opportunities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load opportunity");
      const opp = data.opportunity ?? data.data ?? data;
      setForm({
        title:        opp.title        ?? "",
        description:  opp.description  ?? "",
        type:         opp.type         ?? "field",
        category:     opp.category     ?? "",
        location:     opp.location     ?? "",
        requirements: opp.requirements ?? "",
        positions:    opp.positions    ?? 1,
        deadline:     opp.deadline     ?? "",
        status:       opp.status       ?? "open",
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
    if (!token) { router.push("/login"); return; }
    try {
      setSaving(true); setError(""); setSuccess("");
      const res  = await fetch(`${API_URL}/opportunities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, positions: Number(form.positions) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update opportunity");
      setSuccess("Opportunity updated successfully!");
      setTimeout(() => router.push("/company/opportunities"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container py-8 space-y-4">
        <div className="skeleton h-5 w-32" />
        <div className="card rounded-2xl p-8 space-y-4">
          <div className="skeleton h-8 w-56" />
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-12 w-full rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8 md:py-10">

      <Link href="/company/opportunities"
        className="inline-flex items-center gap-1 text-sm font-semibold hover:underline"
        style={{ color: "var(--brand-600)" }}>
        ← Back to Opportunities
      </Link>

      <div className="mt-5 animate-fade-in">
        <span className="section-eyebrow">Edit</span>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Edit Opportunity</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Update the details of this opportunity.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card mt-6 animate-fade-in rounded-2xl p-8">

          {/* Type selector */}
          <div>
            <label className="field-label">Opportunity Type</label>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TYPES.map(({ value, icon, label }) => {
                const active = form.type === value;
                return (
                  <button key={value} type="button" onClick={() => setForm((p) => ({ ...p, type: value }))}
                    className="relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition"
                    style={{ borderColor: active ? "var(--brand-600)" : "var(--border)", background: active ? "var(--brand-50)" : "var(--surface)", boxShadow: active ? "0 0 0 3px rgba(40,167,69,0.1)" : "none" }}>
                    {active && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
                        style={{ background: "var(--brand-600)" }}>✓</span>
                    )}
                    <span className="text-2xl">{icon}</span>
                    <span className="text-sm font-semibold" style={{ color: active ? "var(--brand-700)" : "var(--text-primary)" }}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div className="mt-6">
            <label className="field-label" htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange} className="field-input max-w-xs">
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <Section title="Basic Information">
            <div className="space-y-4">
              <div>
                <label className="field-label" htmlFor="title">Opportunity Title</label>
                <input id="title" type="text" name="title" value={form.title} onChange={handleChange}
                  required className="field-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="description">Description</label>
                <textarea id="description" name="description" value={form.description} onChange={handleChange}
                  rows={7} required className="field-input resize-y" />
              </div>
            </div>
          </Section>

          <Section title="Opportunity Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="category">Category</label>
                <input id="category" type="text" name="category" value={form.category}
                  onChange={handleChange} required className="field-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="location">Location</label>
                <input id="location" type="text" name="location" value={form.location}
                  onChange={handleChange} required className="field-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="positions">Number of Positions</label>
                <input id="positions" type="number" name="positions" min="1" value={form.positions}
                  onChange={handleChange} required className="field-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="deadline">Application Deadline</label>
                <input id="deadline" type="date" name="deadline" value={form.deadline}
                  onChange={handleChange} required className="field-input" />
              </div>
            </div>
          </Section>

          <Section title="Requirements">
            <textarea name="requirements" value={form.requirements} onChange={handleChange}
              rows={6} className="field-input resize-y" />
          </Section>

          {error   && <div className="alert alert-error mt-6 animate-fade-in">{error}</div>}
          {success && <div className="alert alert-success mt-6 animate-fade-in">{success}</div>}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link href="/company/opportunities" className="btn btn-ghost btn-lg text-center">Cancel</Link>
            <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
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
