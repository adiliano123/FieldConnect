"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://localhost:5000/api";

const STATUS_STYLE = {
  open:   { bg: "#dcfce7", color: "#15803d" },
  closed: { bg: "#fee2e2", color: "#b91c1c" },
};

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [opportunity, setOpportunity] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading]   = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    // eslint-disable-next-line react-hooks/immutability
    fetchOpportunity(token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchOpportunity = async (token) => {
    try {
      setLoading(true); setError("");
      const res  = await fetch(`${API_URL}/opportunities/${params.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load opportunity");
      setOpportunity(data.opportunity ?? data.data ?? data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    if (!coverLetter.trim()) { setError("Please write a cover letter before applying."); return; }
    try {
      setApplying(true); setError(""); setSuccess("");
      const res  = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ opportunityId: Number(params.id), coverLetter: coverLetter.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit application");
      setSuccess("Application submitted successfully!");
      setCoverLetter("");
      setTimeout(() => router.push("/student/applications"), 1400);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="page-container py-8 space-y-4">
        <div className="skeleton h-5 w-32" />
        <div className="card rounded-2xl p-8 space-y-4">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-8 w-2/3" />
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-32 w-full mt-4" />
        </div>
      </div>
    );
  }

  /* ── Hard error ── */
  if (error && !opportunity) {
    return (
      <div className="page-container py-8">
        <div className="alert alert-error">{error}</div>
        <Link href="/student/opportunities"
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
          style={{ color: "var(--brand-600)" }}>
          ← Back to Opportunities
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_STYLE[opportunity.status?.toLowerCase()] ?? { bg: "#f1f5f9", color: "#475569" };

  return (
    <div className="page-container py-8 md:py-10">

      <Link href="/student/opportunities"
        className="inline-flex items-center gap-1 text-sm font-semibold transition hover:underline"
        style={{ color: "var(--brand-600)" }}>
        ← Back to Opportunities
      </Link>

      {/* Opportunity card */}
      <div className="card mt-5 animate-fade-in rounded-2xl p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <span className="badge capitalize" style={{ background: "#f0faf3", color: "#1e7e34" }}>
              {opportunity.type}
            </span>
            <h1 className="mt-3 text-3xl font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
              {opportunity.title}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              🏢 {opportunity.company_name ?? opportunity.companyName ?? "Company"}
            </p>
          </div>
          <span className="badge shrink-0 capitalize" style={statusStyle}>
            {opportunity.status ?? "open"}
          </span>
        </div>

        <div className="mt-7 grid gap-5 border-y py-6 sm:grid-cols-2 md:grid-cols-4"
          style={{ borderColor: "var(--border)" }}>
          {[
            { label: "Category",  value: opportunity.category },
            { label: "Location",  value: `📍 ${opportunity.location}` },
            { label: "Positions", value: opportunity.positions },
            { label: "Deadline",  value: opportunity.deadline ?? "Open" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="mt-1 font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Description</h2>
          <p className="mt-3 whitespace-pre-line leading-7 text-sm" style={{ color: "var(--text-secondary)" }}>
            {opportunity.description}
          </p>
        </div>

        {opportunity.requirements && (
          <div className="mt-7 border-t pt-7" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Requirements</h2>
            <p className="mt-3 whitespace-pre-line leading-7 text-sm" style={{ color: "var(--text-secondary)" }}>
              {opportunity.requirements}
            </p>
          </div>
        )}
      </div>

      {/* Apply form */}
      <div className="card mt-6 animate-fade-in rounded-2xl p-8" style={{ animationDelay: "0.08s" }}>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Apply for this Opportunity</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Tell the organisation why you are a great candidate.
        </p>

        <form onSubmit={handleApply} className="mt-6 space-y-4">
          <div>
            <label className="field-label" htmlFor="cover">Cover Letter</label>
            <textarea id="cover" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
              rows={10} placeholder="Write your cover letter here…" required className="field-input resize-y" />
          </div>

          {error   && <div className="alert alert-error animate-fade-in">{error}</div>}
          {success && <div className="alert alert-success animate-fade-in">{success}</div>}

          <button type="submit" disabled={applying} className="btn btn-primary btn-lg w-full">
            {applying ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3-3-3-3v4a8 8 0 1 0 8 8h-4l3 3 3-3h-4a8 8 0 0 1-8 8z"/>
                </svg>
                Submitting…
              </span>
            ) : "Submit Application"}
          </button>
        </form>
      </div>

    </div>
  );
}
