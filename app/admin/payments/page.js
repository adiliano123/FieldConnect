"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

const STATUS_STYLE = {
  completed: { bg: "#dcfce7", color: "#15803d", dot: "#16a34a", label: "Paid"    },
  pending:   { bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04", label: "Pending" },
  failed:    { bg: "#fee2e2", color: "#b91c1c", dot: "#dc2626", label: "Failed"  },
};
const s = (status) => STATUS_STYLE[status?.toLowerCase()] ?? STATUS_STYLE.pending;

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetch(`${API_URL}/admin/payments`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setPayments(d.payments ?? d.data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const totals = useMemo(() => ({
    all:       payments.length,
    completed: payments.filter((p) => p.status === "completed").length,
    pending:   payments.filter((p) => p.status === "pending").length,
    failed:    payments.filter((p) => p.status === "failed").length,
    revenue:   payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + Number(p.amount), 0),
  }), [payments]);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (kw && ![p.student_name, p.student_email, p.opportunity_title, p.company_name, p.tx_ref]
        .some((v) => v?.toLowerCase().includes(kw))) return false;
      return true;
    });
  }, [payments, filter, search]);

  const FILTERS = [
    { key: "all",       label: "All",       count: totals.all,       bg: "#f1f5f9", color: "#475569" },
    { key: "completed", label: "Paid",      count: totals.completed, ...STATUS_STYLE.completed },
    { key: "pending",   label: "Pending",   count: totals.pending,   ...STATUS_STYLE.pending   },
    { key: "failed",    label: "Failed",    count: totals.failed,    ...STATUS_STYLE.failed    },
  ];

  return (
    <div className="page-container py-8 md:py-10">

      {/* Header */}
      <div className="animate-fade-in">
        <span className="section-eyebrow">Finance</span>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Payments</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          All placement fee payments collected through FieldConnect.
        </p>
      </div>

      {/* Revenue + summary cards */}
      {!loading && !error && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
          {[
            { label: "Total Revenue",    value: `TZS ${totals.revenue.toLocaleString()}`, icon: "💰", bg: "var(--brand-50)",  color: "var(--brand-700)" },
            { label: "Paid",             value: totals.completed,                          icon: "✅", bg: "#dcfce7",          color: "#15803d"           },
            { label: "Pending",          value: totals.pending,                            icon: "⏳", bg: "#fef9c3",          color: "#854d0e"           },
            { label: "Failed",           value: totals.failed,                             icon: "❌", bg: "#fee2e2",          color: "#b91c1c"           },
          ].map(({ label, value, icon, bg, color }) => (
            <div key={label} className="card flex items-center gap-4 rounded-2xl p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                style={{ background: bg, color }}>{icon}</span>
              <div>
                <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      {!loading && !error && (
        <div className="mt-5 flex flex-wrap gap-2 animate-fade-in">
          {FILTERS.map(({ key, label, count, bg, color }) => (
            <button key={key} onClick={() => setFilter(key)} className="badge cursor-pointer transition"
              style={{
                background: filter === key ? bg    : "var(--surface-muted)",
                color:      filter === key ? color : "var(--text-secondary)",
                border:     filter === key ? `1.5px solid ${color}40` : "1.5px solid transparent",
                fontWeight: filter === key ? 700   : 500,
              }}>
              {label} · {count}
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
          placeholder="Search by student, opportunity, ref…" className="field-input pl-10" />
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card rounded-2xl p-5 space-y-2">
              <div className="flex justify-between"><div className="skeleton h-5 w-56" /><div className="skeleton h-6 w-20 rounded-full" /></div>
              <div className="skeleton h-4 w-40" /><div className="skeleton h-4 w-32" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && <div className="alert alert-error mt-6">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card mt-6 flex flex-col items-center rounded-2xl py-16 text-center">
          <span className="text-5xl">💳</span>
          <h2 className="mt-4 text-xl font-bold" style={{ color: "var(--text-primary)" }}>No Payments Found</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {search || filter !== "all" ? "Try changing your search or filter." : "No payments have been made yet."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="mt-5 card rounded-2xl overflow-hidden animate-fade-in">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--surface-muted)", borderBottom: "1px solid var(--border)" }}>
                {["Student", "Opportunity", "Type", "Amount", "Method", "Status", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const st = s(p.status);
                return (
                  <tr key={p.id} className="transition hover:bg-[var(--surface-muted)]"
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td className="px-4 py-4">
                      <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{p.student_name ?? "—"}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.student_email ?? "—"}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="truncate max-w-[160px]" style={{ color: "var(--text-secondary)" }}>
                        {p.opportunity_title ?? "—"}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.company_name ?? "—"}</p>
                    </td>
                    <td className="px-4 py-4 capitalize" style={{ color: "var(--text-secondary)" }}>
                      {p.opportunity_type ?? "—"}
                    </td>
                    <td className="px-4 py-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                      TZS {Number(p.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 capitalize" style={{ color: "var(--text-secondary)" }}>
                      {p.payment_method ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold w-fit"
                        style={{ background: st.bg, color: st.color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.dot }} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs" style={{ color: "var(--text-muted)" }}>
                      {p.created_at ? new Date(p.created_at).toLocaleDateString("en-TZ") : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
