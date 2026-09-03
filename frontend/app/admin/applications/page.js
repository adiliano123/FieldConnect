"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

const STATUS_MAP = {
  pending:   { bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04", label: "Pending"   },
  reviewing: { bg: "#f0faf3", color: "#1e7e34", dot: "#48bb6e", label: "Reviewing" },
  accepted:  { bg: "#dcfce7", color: "#15803d", dot: "#16a34a", label: "Accepted"  },
  rejected:  { bg: "#fee2e2", color: "#b91c1c", dot: "#dc2626", label: "Rejected"  },
};
const s = (status) => STATUS_MAP[status?.toLowerCase()] ?? STATUS_MAP.pending;

const FILTERS = [
  { key: "all",       label: "All",       bg: "#f1f5f9", color: "#475569" },
  { key: "pending",   ...STATUS_MAP.pending   },
  { key: "reviewing", ...STATUS_MAP.reviewing },
  { key: "accepted",  ...STATUS_MAP.accepted  },
  { key: "rejected",  ...STATUS_MAP.rejected  },
];

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetch(`${API_URL}/admin/applications`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setApplications(d.applications ?? d.data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const counts = useMemo(() => ({
    all:       applications.length,
    pending:   applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    accepted:  applications.filter((a) => a.status === "accepted").length,
    rejected:  applications.filter((a) => a.status === "rejected").length,
  }), [applications]);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return applications.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (kw && ![a.student_name, a.opportunity_title, a.company_name, a.student_email]
        .some((v) => v?.toLowerCase().includes(kw))) return false;
      return true;
    });
  }, [applications, filter, search]);

  return (
    <div className="page-container py-8 md:py-10">

      <div className="animate-fade-in">
        <span className="section-eyebrow">Platform</span>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>All Applications</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Full overview of every student application on the platform.
        </p>
      </div>

      {/* Filter tabs */}
      {!loading && !error && (
        <div className="mt-5 flex flex-wrap gap-2 animate-fade-in">
          {FILTERS.map(({ key, label, bg, color }) => (
            <button key={key} onClick={() => setFilter(key)} className="badge cursor-pointer transition"
              style={{
                background: filter === key ? bg    : "var(--surface-muted)",
                color:      filter === key ? color : "var(--text-secondary)",
                border:     filter === key ? `1.5px solid ${color}40` : "1.5px solid transparent",
                fontWeight: filter === key ? 700   : 500,
              }}>
              {label} · {counts[key]}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="mt-4 relative max-w-sm">
        <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16"
          viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
          <circle cx="8" cy="8" r="6"/><path d="m14 14 4 4"/>
        </svg>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student, opportunity, company…" className="field-input pl-10" />
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card rounded-2xl p-5 space-y-2">
              <div className="flex justify-between"><div className="skeleton h-5 w-56" /><div className="skeleton h-6 w-24 rounded-full" /></div>
              <div className="skeleton h-4 w-40" /><div className="skeleton h-4 w-32" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && <div className="alert alert-error mt-6">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card mt-6 flex flex-col items-center rounded-2xl py-16 text-center">
          <span className="text-5xl">📝</span>
          <h2 className="mt-4 text-xl font-bold" style={{ color: "var(--text-primary)" }}>No Applications Found</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {search || filter !== "all" ? "Try changing your search or filter." : "No applications submitted yet."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="mt-5 space-y-3 animate-fade-in">
          {filtered.map((app) => {
            const st     = s(app.status);
            const isOpen = expanded === app.id;
            return (
              <div key={app.id} className="card rounded-2xl overflow-hidden">
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold truncate" style={{ color: "var(--text-primary)" }}>
                      {app.opportunity_title ?? app.title ?? "Opportunity"}
                    </h2>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm" style={{ color: "var(--text-muted)" }}>
                      <span>👤 {app.student_name ?? "Student"}</span>
                      {app.student_email && <span>{app.student_email}</span>}
                      <span>🏢 {app.company_name ?? "—"}</span>
                      <span>📅 {app.applied_at ?? "—"}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold capitalize"
                      style={{ background: st.bg, color: st.color }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.dot }} />
                      {st.label}
                    </span>
                    {app.cover_letter && (
                      <button onClick={() => setExpanded(isOpen ? null : app.id)} className="btn btn-ghost btn-sm">
                        {isOpen ? "Hide" : "Cover Letter"}
                      </button>
                    )}
                  </div>
                </div>

                {isOpen && app.cover_letter && (
                  <div className="border-t px-5 pb-5 pt-4 animate-fade-in"
                    style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                      Cover Letter
                    </p>
                    <p className="whitespace-pre-line text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                      {app.cover_letter}
                    </p>
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
