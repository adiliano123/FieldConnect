"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

export default function CompanyDashboardPage() {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [stats, setStats]     = useState({ opportunities: 0, applications: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    // eslint-disable-next-line react-hooks/immutability
    loadDashboard(token);
  }, [router]);

  const loadDashboard = async (token) => {
    try {
      setLoading(true);
      const h = { Authorization: `Bearer ${token}` };

      const [profRes, oppsRes, appsRes] = await Promise.all([
        fetch(`${API_URL}/companies/profile`,     { headers: h }),
        fetch(`${API_URL}/opportunities/company`, { headers: h }),
        fetch(`${API_URL}/applications/company`,  { headers: h }),
      ]);

      const profData = await profRes.json();
      if (!profRes.ok) throw new Error(profData.message || "Failed to load profile");
      setCompany(profData.company ?? profData.data ?? {});

      const opps = oppsRes.ok ? ((await oppsRes.json()).opportunities ?? []) : [];
      const apps = appsRes.ok ? ((await appsRes.json()).applications  ?? []) : [];

      setStats({
        opportunities: opps.length,
        applications:  apps.length,
        active:        opps.filter((o) => o.status === "open").length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Opportunities", value: stats.opportunities, icon: "📋", bg: "#f0faf3", color: "#1e7e34" },
    { label: "Active / Open",       value: stats.active,        icon: "🟢", bg: "#dcfce7", color: "#15803d" },
    { label: "Applications",        value: stats.applications,  icon: "👥", bg: "#fffbeb", color: "#b38600" },
  ];

  const quickLinks = [
    { href: "/company/opportunities/create", icon: "➕", label: "Post Opportunity",    desc: "Create a new field, internship or attachment opening." },
    { href: "/company/applications",         icon: "👥", label: "Review Applications", desc: "Accept or reject student applications." },
    { href: "/company/profile",              icon: "🏢", label: "Company Profile",     desc: "Update your organisation's information." },
  ];

  return (
    <div className="page-container py-8 md:py-10">

      {/* Welcome banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 text-white animate-fade-in"
        style={{ background: "linear-gradient(135deg, #7c5c00 0%, #e0a800 55%, #ffc107 100%)", boxShadow: "0 8px 24px -6px rgba(40,167,69,0.3)" }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -right-4 bottom-0 h-32 w-32 rounded-full bg-white/5" />

        {loading ? (
          <div className="space-y-2">
            <div className="skeleton h-4 w-32" style={{ background: "rgba(255,255,255,0.2)" }} />
            <div className="skeleton h-8 w-56" style={{ background: "rgba(255,255,255,0.2)" }} />
          </div>
        ) : (
          <>
            <p className="text-sm font-medium" style={{ color: "#ffe8a1" }}>Company Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold">
              {company?.company_name ? `Welcome, ${company.company_name} 👋` : "Welcome back 👋"}
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-6" style={{ color: "#fff3cd" }}>
              Manage your opportunities, review student applications and keep your organisation profile up to date.
            </p>
            <Link
              href="/company/opportunities/create"
              className="btn mt-5 inline-flex"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.25)" }}
            >
              Post New Opportunity →
            </Link>
          </>
        )}
      </div>

      {error && <div className="alert alert-error mt-5">{error}</div>}

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {statCards.map(({ label, value, icon, bg, color }) => (
          <div key={label} className="card flex items-center gap-4 rounded-2xl p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl" style={{ background: bg, color }}>
              {icon}
            </span>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{loading ? "—" : value}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--text-primary)" }}>Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickLinks.map(({ href, icon, label, desc }) => (
            <Link key={href} href={href} className="card card-hover flex flex-col gap-3 rounded-2xl p-6">
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
                <p className="mt-0.5 text-sm" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
              <span className="mt-auto text-sm font-semibold" style={{ color: "var(--brand-600)" }}>Go →</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Verification badge */}
      <div className="card mt-8 flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
            style={{ background: "#fffbeb", color: "var(--brand-600)" }}>🏅</span>
          <div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Organisation Verification</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Verified organisations build more trust with students.
            </p>
          </div>
        </div>
        {!loading && (
          Number(company?.is_verified) === 1
            ? <span className="badge badge-green shrink-0">✓ Verified</span>
            : <span className="badge badge-yellow shrink-0">⏳ Pending Verification</span>
        )}
      </div>

    </div>
  );
}
