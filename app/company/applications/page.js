"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

const STATUS_MAP = {
  pending:   { bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04", label: "Pending"   },
  reviewing: { bg: "#f0faf3", color: "#1e7e34", dot: "#48bb6e", label: "Reviewing" },
  accepted:  { bg: "#dcfce7", color: "#15803d", dot: "#16a34a", label: "Accepted"  },
  rejected:  { bg: "#fff3cd", color: "#b91c1c", dot: "#b91c1c", label: "Rejected"  },
};
const STATUS_MSG = {
  accepted:  { bg: "#f0fdf4", color: "#166534", text: "🎉 Application accepted. The student has been notified." },
  rejected:  { bg: "#fffbeb", color: "#991b1b", text: "Application rejected. The student has been notified." },
  reviewing: { bg: "#f0faf3", color: "#1e7e34", text: "Application is marked as under review." },
  pending:   { bg: "#fffbeb", color: "#92400e", text: "Awaiting your review." },
};
const s = (status) => STATUS_MAP[status?.toLowerCase()] ?? STATUS_MAP.pending;

const FILTERS = [
  { key: "all",       label: "All",       bg: "#f1f5f9", color: "#475569" },
  { key: "pending",   label: "Pending",   ...STATUS_MAP.pending   },
  { key: "reviewing", label: "Reviewing", ...STATUS_MAP.reviewing },
  { key: "accepted",  label: "Accepted",  ...STATUS_MAP.accepted  },
  { key: "rejected",  label: "Rejected",  ...STATUS_MAP.rejected  },
];

export default function CompanyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filter, setFilter]     = useState("all");
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetch(`${API_URL}/applications/company`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (!d.applications && !d.data) throw new Error(d.message); setApplications(d.applications ?? d.data ?? []); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      setUpdating(id);
      const res  = await fetch(`${API_URL}/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setApplications((p) => p.map((a) => a.id === id ? { ...a, status } : a));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const counts = useMemo(() => ({
    all: applications.length,
    pending:   applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    accepted:  applications.filter((a) => a.status === "accepted").length,
    rejected:  applications.filter((a) => a.status === "rejected").length,
  }), [applications]);

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter);

  return (
    <div className="page-container py-8 md:py-10">

      <div className="animate-fade-in">
        <span className="section-eyebrow">Inbox</span>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Student Applications</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Review, accept or reject applications from students.</p>
      </div>

      {!loading && !error && (
        <div className="mt-5 flex flex-wrap gap-2 animate-fade-in">
          {FILTERS.map(({ key, label, bg, color }) => (
            <button key={key} onClick={() => setFilter(key)} className="badge cursor-pointer transition"
              style={{ background: filter === key ? bg : "var(--surface-muted)", color: filter === key ? color : "var(--text-secondary)", border: filter === key ? `1.5px solid ${color}30` : "1.5px solid transparent", fontWeight: filter === key ? 700 : 500 }}>
              {label} · {counts[key]}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card rounded-2xl p-6 space-y-3">
              <div className="flex justify-between"><div className="skeleton h-5 w-56" /><div className="skeleton h-6 w-24 rounded-full" /></div>
              <div className="skeleton h-4 w-40" /><div className="skeleton h-4 w-32" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && <div className="alert alert-error mt-6">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card mt-6 flex flex-col items-center rounded-2xl py-16 text-center">
          <span className="text-5xl">📄</span>
          <h2 className="mt-4 text-xl font-bold" style={{ color: "var(--text-primary)" }}>No Applications Found</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {filter === "all" ? "No students have applied yet." : `No ${filter} applications.`}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="mt-6 space-y-4 animate-fade-in">
          {filtered.map((app) => {
            const st    = s(app.status);
            const isOpen = expanded === app.id;
            const busy  = updating === app.id;
            const msg   = STATUS_MSG[app.status?.toLowerCase()] ?? STATUS_MSG.pending;
            return (
              <div key={app.id} className="card rounded-2xl overflow-hidden">
                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                      {app.opportunity_title ?? app.title ?? "Opportunity"}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>👤 {app.student_name ?? "Student"}</span>
                      {app.student_email && <span className="text-sm" style={{ color: "var(--text-muted)" }}>{app.student_email}</span>}
                      <span className="text-sm" style={{ color: "var(--text-muted)" }}>📅 {app.applied_at ?? "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold capitalize"
                      style={{ background: st.bg, color: st.color }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.dot }} />{st.label}
                    </span>
                    {app.cover_letter && (
                      <button onClick={() => setExpanded(isOpen ? null : app.id)} className="btn btn-ghost btn-sm">
                        {isOpen ? "Hide" : "Cover Letter"}
                      </button>
                    )}
                    {app.status !== "accepted" && (
                      <button onClick={() => updateStatus(app.id, "accepted")} disabled={busy} className="btn btn-sm"
                        style={{ background: "#dcfce7", color: "#15803d", border: "1.5px solid #86efac" }}>
                        {busy ? "…" : "Accept"}
                      </button>
                    )}
                    {app.status !== "reviewing" && app.status !== "accepted" && (
                      <button onClick={() => updateStatus(app.id, "reviewing")} disabled={busy} className="btn btn-sm"
                        style={{ background: "#f0faf3", color: "#1e7e34", border: "1.5px solid #a7f3c0" }}>
                        {busy ? "…" : "Review"}
                      </button>
                    )}
                    {app.status !== "rejected" && (
                      <button onClick={() => updateStatus(app.id, "rejected")} disabled={busy} className="btn btn-sm"
                        style={{ background: "#fff3cd", color: "#b91c1c", border: "1.5px solid #fca5a5" }}>
                        {busy ? "…" : "Reject"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mx-6 mb-4 rounded-xl px-4 py-3 text-sm" style={{ background: msg.bg, color: msg.color }}>
                  {msg.text}
                </div>
                {isOpen && app.cover_letter && (
                  <div className="border-t px-6 pb-6 pt-5 animate-fade-in" style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Cover Letter</p>
                    <p className="whitespace-pre-line text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{app.cover_letter}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
