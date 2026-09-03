"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

const TYPE_COLORS = {
  field:       { bg: "#f0faf3", color: "#1e7e34" },
  internship:  { bg: "#fffbeb", color: "#b38600" },
  attachment:  { bg: "#ecfdf5", color: "#065f46" },
  volunteer:   { bg: "#fff7ed", color: "#c2410c" },
};

function typeBadgeStyle(type) {
  return TYPE_COLORS[type?.toLowerCase()] ?? { bg: "#f1f5f9", color: "#475569" };
}

export default function OpportunitiesPage() {
  const router = useRouter();

  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch]       = useState("");
  const [type, setType]           = useState("all");
  const [category, setCategory]   = useState("all");
  const [location, setLocation]   = useState("all");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    // eslint-disable-next-line react-hooks/immutability
    fetchOpportunities(token);
  }, [router]);

  const fetchOpportunities = async (token) => {
    try {
      setLoading(true);
      setError("");
      const res  = await fetch(`${API_URL}/opportunities`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load opportunities");
      setOpportunities(data.opportunities ?? data.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => [...new Set(opportunities.map((o) => o.category).filter(Boolean))], [opportunities]);
  const locations  = useMemo(() => [...new Set(opportunities.map((o) => o.location).filter(Boolean))], [opportunities]);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return opportunities.filter((o) => {
      if (kw && !["title","description","category","location"].some((k) => o[k]?.toLowerCase().includes(kw))) return false;
      if (type     !== "all" && o.type?.toLowerCase()     !== type)     return false;
      if (category !== "all" && o.category?.toLowerCase() !== category) return false;
      if (location !== "all" && o.location?.toLowerCase() !== location) return false;
      return true;
    });
  }, [opportunities, search, type, category, location]);

  return (
    <div className="page-container py-8 md:py-10">

            {/* Page header */}
            <div className="animate-fade-in">
              <span className="section-eyebrow">Browse</span>
              <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                Find Your Opportunity
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                Search field training, internships, attachments and volunteer positions.
              </p>
            </div>

            {/* Search & filters */}
            <div className="card mt-6 rounded-2xl p-5">
              {/* Search bar */}
              <div className="relative">
                <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16"
                  viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ color: "var(--text-muted)" }}>
                  <circle cx="8" cy="8" r="6"/><path d="m14 14 4 4"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, category, location…"
                  className="field-input pl-10"
                />
              </div>

              {/* Dropdowns */}
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    value: type, onChange: setType,
                    options: [
                      ["all","All Types"],["field","Field"],["internship","Internship"],
                      ["attachment","Attachment"],["volunteer","Volunteer"],
                    ],
                  },
                  {
                    value: category, onChange: setCategory,
                    options: [["all","All Categories"], ...categories.map((c) => [c, c])],
                  },
                  {
                    value: location, onChange: setLocation,
                    options: [["all","All Locations"], ...locations.map((l) => [l, l])],
                  },
                ].map(({ value, onChange, options }, i) => (
                  <select
                    key={i}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="field-input"
                  >
                    {options.map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                ))}
              </div>
            </div>

            {/* Results header */}
            <div className="mt-8 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                Available Opportunities
              </h2>
              {!loading && (
                <span className="badge badge-gray">
                  {filtered.length} found
                </span>
              )}
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card rounded-2xl p-6 space-y-3">
                    <div className="skeleton h-5 w-20 rounded-full" />
                    <div className="skeleton h-6 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-16 w-full mt-2" />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="alert alert-error mt-6">{error}</div>
            )}

            {/* Empty state */}
            {!loading && !error && filtered.length === 0 && (
              <div className="card mt-6 flex flex-col items-center rounded-2xl py-16 text-center">
                <span className="text-5xl">🔎</span>
                <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  No opportunities found
                </h3>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                  Try adjusting your search or filters.
                </p>
              </div>
            )}

            {/* Cards grid */}
            {!loading && !error && filtered.length > 0 && (
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                {filtered.map((opp) => {
                  const { bg, color } = typeBadgeStyle(opp.type);
                  return (
                    <div key={opp.id} className="card card-hover flex flex-col rounded-2xl p-6">
                      {/* Type badge */}
                      <span className="badge self-start capitalize" style={{ background: bg, color }}>
                        {opp.type}
                      </span>

                      {/* Title */}
                      <h3 className="mt-4 text-lg font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
                        {opp.title}
                      </h3>

                      {/* Meta */}
                      <div className="mt-3 space-y-1.5">
                        <p className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <span>🏢</span> {opp.company_name || "Company"}
                        </p>
                        <p className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <span>📍</span> {opp.location}
                        </p>
                        <p className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <span>📚</span> {opp.category}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                        {opp.description}
                      </p>

                      {/* Footer */}
                      <div
                        className="mt-5 flex items-center justify-between border-t pt-4"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Deadline</p>
                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                            {opp.deadline ?? "Open"}
                          </p>
                        </div>
                        <Link href={`/student/opportunities/${opp.id}`} className="btn btn-primary btn-sm">
                          View →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

    </div>
  );
}
