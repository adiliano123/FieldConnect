"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

const TYPE_STYLE = {
  field:      { bg: "#f0faf3", color: "#1e7e34" },
  internship: { bg: "#fffbeb", color: "#b38600" },
  attachment: { bg: "#ecfdf5", color: "#065f46" },
  volunteer:  { bg: "#fff7ed", color: "#c2410c" },
};

export default function AdminOpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleting, setDeleting]     = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetch(`${API_URL}/admin/opportunities`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setOpportunities(d.opportunities ?? d.data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const deleteOpp = async (id) => {
    if (!window.confirm("Delete this opportunity?")) return;
    const token = localStorage.getItem("token");
    try {
      setDeleting(id);
      const res = await fetch(`${API_URL}/opportunities/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to delete");
      setOpportunities((p) => p.filter((o) => o.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return opportunities.filter((o) => {
      if (typeFilter !== "all" && o.type?.toLowerCase() !== typeFilter) return false;
      if (kw && !["title", "category", "location", "company_name"].some((k) => o[k]?.toLowerCase().includes(kw))) return false;
      return true;
    });
  }, [opportunities, search, typeFilter]);

  const counts = useMemo(() => ({
    all:        opportunities.length,
    open:       opportunities.filter((o) => o.status === "open").length,
    closed:     opportunities.filter((o) => o.status !== "open").length,
    field:      opportunities.filter((o) => o.type === "field").length,
    internship: opportunities.filter((o) => o.type === "internship").length,
    attachment: opportunities.filter((o) => o.type === "attachment").length,
    volunteer:  opportunities.filter((o) => o.type === "volunteer").length,
  }), [opportunities]);

  return (
    <div className="page-container py-8 md:py-10">

      <div className="animate-fade-in">
        <span className="section-eyebrow">Platform</span>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>All Opportunities</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Oversee every opportunity posted across the platform.
        </p>
      </div>

      {/* Summary chips */}
      {!loading && !error && (
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="badge badge-gray">All · {counts.all}</span>
          <span className="badge badge-green">Open · {counts.open}</span>
          <span className="badge badge-yellow">Closed · {counts.closed}</span>
        </div>
      )}

      {/* Search + type filter */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16"
            viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
            <circle cx="8" cy="8" r="6"/><path d="m14 14 4 4"/>
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, company…" className="field-input pl-10" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="field-input max-w-xs">
          <option value="all">All Types ({counts.all})</option>
          <option value="field">Field ({counts.field})</option>
          <option value="internship">Internship ({counts.internship})</option>
          <option value="attachment">Attachment ({counts.attachment})</option>
          <option value="volunteer">Volunteer ({counts.volunteer})</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card rounded-2xl p-5 space-y-2">
              <div className="flex gap-2"><div className="skeleton h-5 w-20 rounded-full" /><div className="skeleton h-5 w-16 rounded-full" /></div>
              <div className="skeleton h-5 w-2/3" /><div className="skeleton h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && <div className="alert alert-error mt-6">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card mt-6 flex flex-col items-center rounded-2xl py-16 text-center">
          <span className="text-5xl">📋</span>
          <h2 className="mt-4 text-xl font-bold" style={{ color: "var(--text-primary)" }}>No Opportunities Found</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Try adjusting your search or filter.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="mt-5 space-y-3 animate-fade-in">
          {filtered.map((opp) => {
            const ts     = TYPE_STYLE[opp.type?.toLowerCase()] ?? { bg: "#f1f5f9", color: "#475569" };
            const isOpen = opp.status === "open";
            return (
              <div key={opp.id} className="card rounded-2xl p-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="badge capitalize" style={{ background: ts.bg, color: ts.color }}>{opp.type}</span>
                    <span className={`badge ${isOpen ? "badge-green" : "badge-gray"}`}>{opp.status ?? "open"}</span>
                  </div>
                  <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>{opp.title}</h2>
                  <div className="mt-1 flex flex-wrap gap-x-4 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span>🏢 {opp.company_name ?? "—"}</span>
                    <span>📍 {opp.location ?? "—"}</span>
                    <span>📚 {opp.category ?? "—"}</span>
                    <span>👥 {opp.positions ?? "—"} positions</span>
                    <span>📅 Deadline: {opp.deadline ?? "Open"}</span>
                  </div>
                </div>
                <button onClick={() => deleteOpp(opp.id)} disabled={deleting === opp.id}
                  className="btn btn-sm shrink-0"
                  style={{ background: "#fee2e2", color: "#b91c1c", border: "1.5px solid #fca5a5" }}>
                  {deleting === opp.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
