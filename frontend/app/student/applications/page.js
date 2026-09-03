/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

const STATUS_MAP = {
  accepted:  { bg: "#dcfce7", color: "#15803d", dot: "#16a34a", label: "Accepted" },
  rejected:  { bg: "#fee2e2", color: "#b91c1c", dot: "#b91c1c", label: "Rejected" },
  reviewing: { bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04", label: "Reviewing" },
  pending:   { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8", label: "Pending" },
};

const PAYMENT_STYLE = {
  completed: { bg: "#dcfce7", color: "#15803d", label: "✓ Paid" },
  pending:   { bg: "#fff7ed", color: "#c2410c", label: "Payment Required" },
  failed:    { bg: "#fee2e2", color: "#b91c1c", label: "Payment Failed" },
};

function statusStyle(status) {
  return STATUS_MAP[status?.toLowerCase()] ?? STATUS_MAP.pending;
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [payments, setPayments]         = useState({});   // applicationId → payment
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchAll(token);
  }, [router]);

  const fetchAll = async (token) => {
    try {
      setLoading(true); setError("");
      const [appsRes, paymentsRes] = await Promise.all([
        fetch(`${API_URL}/applications/my-applications`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/payments/my`,                  { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const appsData     = await appsRes.json();
      const paymentsData = paymentsRes.ok ? await paymentsRes.json() : { payments: [] };
      if (!appsRes.ok) throw new Error(appsData.message || "Failed to load applications");
      setApplications(appsData.applications ?? appsData.data ?? []);
      // index payments by application_id
      const map = {};
      (paymentsData.payments ?? []).forEach((p) => { map[p.application_id] = p; });
      setPayments(map);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = fetchAll; // keep backward compat
  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  /* counts */
  const counts = applications.reduce((acc, a) => {
    const key = a.status?.toLowerCase() ?? "pending";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page-container py-8 md:py-10">

            {/* Header */}
            <div className="animate-fade-in">
              <span className="section-eyebrow">Tracker</span>
              <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                My Applications
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                Track the status of every opportunity you have applied for.
              </p>
            </div>

            {/* Summary chips */}
            {!loading && !error && applications.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 animate-fade-in">
                {[
                  { key: "all",       label: "All",       value: applications.length, bg: "#f1f5f9", color: "#475569" },
                  { key: "pending",   label: "Pending",   value: counts.pending   ?? 0, ...STATUS_MAP.pending },
                  { key: "reviewing", label: "Reviewing", value: counts.reviewing ?? 0, ...STATUS_MAP.reviewing },
                  { key: "accepted",  label: "Accepted",  value: counts.accepted  ?? 0, ...STATUS_MAP.accepted },
                  { key: "rejected",  label: "Rejected",  value: counts.rejected  ?? 0, ...STATUS_MAP.rejected },
                ].map(({ key, label, value, bg, color }) => (
                  <span key={key} className="badge font-semibold" style={{ background: bg, color }}>
                    {label} · {value}
                  </span>
                ))}
              </div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <div className="mt-6 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between">
                      <div className="skeleton h-5 w-56" />
                      <div className="skeleton h-6 w-20 rounded-full" />
                    </div>
                    <div className="skeleton h-4 w-40" />
                    <div className="skeleton h-4 w-32" />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="alert alert-error mt-6">{error}</div>
            )}

            {/* Empty */}
            {!loading && !error && applications.length === 0 && (
              <div className="card mt-6 flex flex-col items-center rounded-2xl py-16 text-center">
                <span className="text-5xl">📝</span>
                <h2 className="mt-4 text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  No Applications Yet
                </h2>
                <p className="mt-2 max-w-sm text-sm" style={{ color: "var(--text-muted)" }}>
                  You haven&apos;t applied for any opportunities yet. Start exploring now.
                </p>
                <Link href="/student/opportunities" className="btn btn-primary mt-6">
                  Find Opportunities
                </Link>
              </div>
            )}

            {/* Application list */}
            {!loading && !error && applications.length > 0 && (
              <div className="mt-6 space-y-4 animate-fade-in">
                {applications.map((app) => {
                  const s        = statusStyle(app.status);
                  const isOpen   = expanded === app.id;
                  const pymnt    = payments[app.id];
                  const isAccepted = app.status === "accepted";
                  const payStyle = pymnt ? PAYMENT_STYLE[pymnt.status] : PAYMENT_STYLE.pending;

                  return (
                    <div key={app.id} className="card rounded-2xl overflow-hidden">
                      {/* Main row */}
                      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <h2 className="truncate text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                            {app.title ?? app.opportunity_title ?? "Opportunity"}
                          </h2>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                            <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                              🏢 {app.company_name ?? "Company"}
                            </span>
                            {app.location && (
                              <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                                📍 {app.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-muted)" }}>
                              📅 Applied: {app.applied_at ?? "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          {/* Status badge */}
                          <span
                            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold capitalize"
                            style={{ background: s.bg, color: s.color }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
                            {s.label}
                          </span>

                          {/* Expand toggle */}
                          {app.cover_letter && (
                            <button
                              onClick={() => toggleExpand(app.id)}
                              className="btn btn-ghost btn-sm"
                              aria-expanded={isOpen}
                            >
                              {isOpen ? "Hide" : "Cover Letter"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Payment section — shown only for accepted applications */}
                      {isAccepted && (
                        <div
                          className="border-t px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                          style={{ borderColor: "var(--border)", background: pymnt?.status === "completed" ? "#f0fdf4" : "#fffbeb" }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">💰</span>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                                Placement Fee
                              </p>
                              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                Required to confirm your placement
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {pymnt && (
                              <span
                                className="badge font-semibold"
                                style={{ background: payStyle.bg, color: payStyle.color }}
                              >
                                {payStyle.label}
                              </span>
                            )}
                            {(!pymnt || pymnt.status !== "completed") && (
                              <Link
                                href={`/student/payment/${app.id}`}
                                className="btn btn-primary btn-sm"
                              >
                                Pay Now →
                              </Link>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Cover letter drawer */}
                      {isOpen && app.cover_letter && (
                        <div
                          className="border-t px-6 pb-6 pt-5 animate-fade-in"
                          style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }}
                        >
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
