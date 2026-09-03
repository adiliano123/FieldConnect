"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

function Avatar({ name }) {
  const i = name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "S";
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ background: "linear-gradient(135deg, #1e7e34, #48bb6e)" }}>{i}</div>
  );
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetch(`${API_URL}/admin/students`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.students ?? d.data) setStudents(d.students ?? d.data ?? []); else throw new Error(d.message); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) return students;
    return students.filter((s) =>
      s.name?.toLowerCase().includes(kw) ||
      s.email?.toLowerCase().includes(kw) ||
      s.university?.toLowerCase().includes(kw) ||
      s.course?.toLowerCase().includes(kw)
    );
  }, [students, search]);

  return (
    <div className="page-container py-8 md:py-10">

      <div className="animate-fade-in">
        <span className="section-eyebrow">Users</span>
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Students</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          All registered students on the platform.
        </p>
      </div>

      {/* Search + count */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16"
            viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
            <circle cx="8" cy="8" r="6"/><path d="m14 14 4 4"/>
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, university…" className="field-input pl-10" />
        </div>
        {!loading && (
          <span className="badge badge-gray shrink-0">{filtered.length} student{filtered.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card rounded-2xl p-4 flex items-center gap-4">
              <div className="skeleton h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2"><div className="skeleton h-4 w-48" /><div className="skeleton h-3 w-36" /></div>
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && <div className="alert alert-error mt-6">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card mt-6 flex flex-col items-center rounded-2xl py-16 text-center">
          <span className="text-5xl">🎓</span>
          <h2 className="mt-4 text-xl font-bold" style={{ color: "var(--text-primary)" }}>No Students Found</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {search ? "Try a different search term." : "No students have registered yet."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="mt-5 card rounded-2xl overflow-hidden animate-fade-in">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--surface-muted)", borderBottom: "1px solid var(--border)" }}>
                {["Student", "University / Course", "Year", "Location", "Phone"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((st, i) => (
                <tr key={st.id ?? i} className="transition hover:bg-[var(--surface-muted)]"
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={st.name} />
                      <div>
                        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{st.name ?? "—"}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{st.email ?? "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p style={{ color: "var(--text-secondary)" }}>{st.university ?? "—"}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{st.course ?? "—"}</p>
                  </td>
                  <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>
                    {st.year_of_study ? `Year ${st.year_of_study}` : "—"}
                  </td>
                  <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>{st.location ?? "—"}</td>
                  <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>{st.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
