"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

const TYPE_STYLE = {
  field:      { bg: "#f0faf3", color: "#1e7e34" },
  internship: { bg: "#fffbeb", color: "#b38600" },
  attachment: { bg: "#ecfdf5", color: "#065f46" },
  volunteer:  { bg: "#fff7ed", color: "#c2410c" },
};

export default function CompanyOpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    // eslint-disable-next-line react-hooks/immutability
    fetchOpportunities(token);
  }, [router]);

  const fetchOpportunities = async (token) => {
    try {
      setLoading(true); setError("");
      const res  = await fetch(`${API_URL}/opportunities/company`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load opportunities");
      setOpportunities(data.opportunities ?? data.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteOpportunity = async (id) => {
    if (!window.confirm("Delete this opportunity? This cannot be undone.")) return;
    const token = localStorage.getItem("token");
    try {
      setDeleting(id);
      const res  = await fetch(`${API_URL}/opportunities/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      setOpportunities((p) => p.filter((o) => o.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const closeOpportunity = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res  = await fetch(`${API_URL}/opportunities/${id}/close`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to close");
      setOpportunities((p) => p.map((o) => o.id === id ? { ...o, status: "closed" } : o));
    } catch (err) {
      alert(err.message);
    }
  };

  const counts = {
    open:   opportunities.filter((o) => o.status === "open").length,
    closed: opportunities.filter((o) => o.status !== "open").length,
  };

  return (
    <div className="page-container py-8 md:py-10">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-in">
        <div>
          <span className="section-eyebrow">Manage</span>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>My Opportunities</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Create, edit and manage your posted opportunities.</p>
        </div>
        <Link href="/company/opportunities/create" className="btn btn-lg shrink-0" style={{ background: "var(--brand-600)", color: "#fff" }}>
          + Post Opportunity
        </Link>
      </div>

      {!loading && !error && opportunities.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="badge" style={{ background: "#f1f5f9", color: "#475569" }}>Total · {opportunities.length}</span>
          <span className="badge badge-green">Open · {counts.open}</span>
          <span className="badge badge-gray">Closed · {counts.closed}</span>
        </div>
      )}

      {loading && (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card rounded-2xl p-6 space-y-3">
              <div className="flex justify-between"><div className="skeleton h-5 w-20 rounded-full" /><div className="skeleton h-5 w-16 rounded-full" /></div>
              <div className="skeleton h-6 w-3/4" /><div className="skeleton h-4 w-full" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && <div className="alert alert-error mt-6">{error}</div>}

      {!loading && !error && opportunities.length === 0 && (
        <div className="card mt-6 flex flex-col items-center rounded-2xl py-16 text-center">
          <span className="text-5xl">📋</span>
          <h2 className="mt-4 text-xl font-bold" style={{ color: "var(--text-primary)" }}>No Opportunities Yet</h2>
          <p className="mt-2 max-w-sm text-sm" style={{ color: "var(--text-muted)" }}>Start attracting talented students by posting your first opportunity.</p>
          <Link href="/company/opportunities/create" className="btn mt-6" style={{ background: "var(--brand-600)", color: "#fff" }}>Post Your First Opportunity</Link>
        </div>
      )}

      {!loading && !error && opportunities.length > 0 && (
        <div className="mt-6 grid gap-5 lg:grid-cols-2 animate-fade-in">
          {opportunities.map((opp) => {
            const ts     = TYPE_STYLE[opp.type?.toLowerCase()] ?? { bg: "#f1f5f9", color: "#475569" };
            const isOpen = opp.status === "open";
            return (
              <div key={opp.id} className="card rounded-2xl p-6 flex flex-col">
                <div className="flex flex-wrap gap-2">
                  <span className="badge capitalize" style={{ background: ts.bg, color: ts.color }}>{opp.type}</span>
                  <span className={`badge ${isOpen ? "badge-green" : "badge-gray"}`}>{opp.status ?? "open"}</span>
                </div>
                <h2 className="mt-4 text-lg font-bold" style={{ color: "var(--text-primary)" }}>{opp.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>{opp.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 border-y py-4 text-sm" style={{ borderColor: "var(--border)" }}>
                  {[{ l: "Category", v: opp.category }, { l: "Location", v: `📍 ${opp.location}` }, { l: "Positions", v: opp.positions }, { l: "Deadline", v: opp.deadline ?? "Open" }].map(({ l, v }) => (
                    <div key={l}>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{l}</p>
                      <p className="mt-0.5 font-semibold" style={{ color: "var(--text-primary)" }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/company/opportunities/${opp.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                  {isOpen && (
                    <button onClick={() => closeOpportunity(opp.id)} className="btn btn-sm"
                      style={{ background: "#fef9c3", color: "#854d0e", border: "1.5px solid #fde047" }}>Close</button>
                  )}
                  <button onClick={() => deleteOpportunity(opp.id)} disabled={deleting === opp.id} className="btn btn-sm"
                    style={{ background: "#fff3cd", color: "#b91c1c", border: "1.5px solid #fca5a5" }}>
                    {deleting === opp.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
