"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

function CompanyAvatar({ name }) {
  const i = name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "CO";
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ background: "linear-gradient(135deg, #7c5c00, #e0a800)" }}>{i}</div>
  );
}

export default function AdminCompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [verifying, setVerifying] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetch(`${API_URL}/admin/companies`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.companies ?? d.data) setCompanies(d.companies ?? d.data ?? []); else throw new Error(d.message); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const toggleVerify = async (id, current) => {
    const token = localStorage.getItem("token");
    try {
      setVerifying(id);
      const res  = await fetch(`${API_URL}/admin/companies/${id}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_verified: current ? 0 : 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setCompanies((p) => p.map((c) => c.id === id ? { ...c, is_verified: current ? 0 : 1 } : c));
    } catch (err) {
      alert(err.message);
    } finally {
      setVerifying(null);
    }
  };

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) return companies;
    return companies.filter((c) =>
      c.company_name?.toLowerCase().includes(kw) ||
      c.email?.toLowerCase().includes(kw) ||
      c.location?.toLowerCase().includes(kw)
    );
  }, [companies, search]);

  const verifiedCount = companies.filter((c) => Number(c.is_verified) === 1).length;

  return (
    <div className="page-container py-8 md:py-10">

      <div className="animate-fade-in">
        <span className="section-eyebrow">Organisations</span>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Companies</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Manage and verify registered organisations.
        </p>
      </div>

      {/* Summary chips */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="badge badge-gray">Total · {companies.length}</span>
        <span className="badge badge-green">Verified · {verifiedCount}</span>
        <span className="badge badge-yellow">Pending · {companies.length - verifiedCount}</span>
      </div>

      {/* Search */}
      <div className="mt-4 relative max-w-sm">
        <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16"
          viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
          <circle cx="8" cy="8" r="6"/><path d="m14 14 4 4"/>
        </svg>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies…" className="field-input pl-10" />
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card rounded-2xl p-5 flex items-center gap-4">
              <div className="skeleton h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2"><div className="skeleton h-4 w-48" /><div className="skeleton h-3 w-36" /></div>
              <div className="skeleton h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && <div className="alert alert-error mt-6">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card mt-6 flex flex-col items-center rounded-2xl py-16 text-center">
          <span className="text-5xl">🏢</span>
          <h2 className="mt-4 text-xl font-bold" style={{ color: "var(--text-primary)" }}>No Companies Found</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {search ? "Try a different search term." : "No companies have registered yet."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="mt-5 space-y-3 animate-fade-in">
          {filtered.map((co) => {
            const verified = Number(co.is_verified) === 1;
            return (
              <div key={co.id} className="card rounded-2xl p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <CompanyAvatar name={co.company_name} />
                  <div className="min-w-0">
                    <p className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>{co.company_name ?? "—"}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {co.email ?? "—"} {co.location ? `· 📍 ${co.location}` : ""}
                    </p>
                    {co.website && (
                      <a href={co.website} target="_blank" rel="noopener noreferrer"
                        className="text-xs hover:underline" style={{ color: "var(--brand-600)" }}>
                        {co.website}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className={`badge ${verified ? "badge-green" : "badge-yellow"}`}>
                    {verified ? "✓ Verified" : "⏳ Pending"}
                  </span>
                  <button onClick={() => toggleVerify(co.id, verified)} disabled={verifying === co.id}
                    className="btn btn-sm"
                    style={verified
                      ? { background: "#fff3cd", color: "#7c5c00", border: "1.5px solid #ffc107" }
                      : { background: "#dcfce7", color: "#15803d", border: "1.5px solid #86efac" }}>
                    {verifying === co.id ? "…" : verified ? "Unverify" : "Verify"}
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
