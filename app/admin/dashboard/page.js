"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats]     = useState({ students: 0, companies: 0, opportunities: 0, applications: 0, pending: 0, verified: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    loadStats(token);
  }, [router]);

  const loadStats = async (token) => {
    try {
      setLoading(true);
      const h = { Authorization: `Bearer ${token}` };
      const [studRes, compRes, oppsRes, appsRes] = await Promise.all([
        fetch(`${API_URL}/admin/students`,      { headers: h }),
        fetch(`${API_URL}/admin/companies`,     { headers: h }),
        fetch(`${API_URL}/admin/opportunities`, { headers: h }),
        fetch(`${API_URL}/admin/applications`,  { headers: h }),
      ]);

      const [studData, compData, oppsData, appsData] = await Promise.all([
        studRes.ok ? studRes.json() : { students: [] },
        compRes.ok ? compRes.json() : { companies: [] },
        oppsRes.ok ? oppsRes.json() : { opportunities: [] },
        appsRes.ok ? appsRes.json() : { applications: [] },
      ]);

      const students      = studData.students      ?? studData.data      ?? [];
      const companies     = compData.companies     ?? compData.data      ?? [];
      const opportunities = oppsData.opportunities ?? oppsData.data      ?? [];
      const applications  = appsData.applications  ?? appsData.data      ?? [];

      setStats({
        students:      students.length,
        companies:     companies.length,
        opportunities: opportunities.length,
        applications:  applications.length,
        pending:       applications.filter((a) => a.status === "pending").length,
        verified:      companies.filter((c) => Number(c.is_verified) === 1).length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Students",       value: stats.students,      icon: "🎓", bg: "#f0faf3", color: "#1e7e34", href: "/admin/students"      },
    { label: "Companies",            value: stats.companies,     icon: "🏢", bg: "#fffbeb", color: "#b38600", href: "/admin/companies"     },
    { label: "Opportunities",        value: stats.opportunities, icon: "📋", bg: "#ecfdf5", color: "#065f46", href: "/admin/opportunities" },
    { label: "Applications",         value: stats.applications,  icon: "📝", bg: "#fff7ed", color: "#c2410c", href: "/admin/applications"  },
    { label: "Pending Applications", value: stats.pending,       icon: "⏳", bg: "#fef9c3", color: "#854d0e", href: "/admin/applications"  },
    { label: "Verified Companies",   value: stats.verified,      icon: "✅", bg: "#dcfce7", color: "#15803d", href: "/admin/companies"     },
  ];

  const quickLinks = [
    { href: "/admin/students",      icon: "🎓", label: "Manage Students",      desc: "View and manage registered students."   },
    { href: "/admin/companies",     icon: "🏢", label: "Manage Companies",     desc: "Verify and manage organisations."       },
    { href: "/admin/opportunities", icon: "📋", label: "Manage Opportunities", desc: "Oversee all posted opportunities."      },
    { href: "/admin/applications",  icon: "📝", label: "Manage Applications",  desc: "Review all student applications."       },
  ];

  return (
    <div className="page-container py-8 md:py-10">

      {/* Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 text-white animate-fade-in"
        style={{
          background: "linear-gradient(135deg, #155724 0%, #28a745 55%, #48bb6e 100%)",
          boxShadow: "0 8px 24px -6px rgba(40,167,69,0.4)",
        }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -right-4 bottom-0 h-32 w-32 rounded-full bg-white/5" />
        <p className="text-sm font-medium" style={{ color: "#ffe8a1" }}>Admin Panel</p>
        <h1 className="mt-1 text-3xl font-bold">Platform Overview</h1>
        <p className="mt-2 max-w-lg text-sm leading-6" style={{ color: "#d4f1dc" }}>
          Monitor all platform activity — students, companies, opportunities and applications — from one place.
        </p>
      </div>

      {error && <div className="alert alert-error mt-5">{error}</div>}

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ label, value, icon, bg, color, href }) => (
          <Link key={label} href={href} className="card card-hover flex items-center gap-4 rounded-2xl p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
              style={{ background: bg, color }}>{icon}</span>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {loading ? "—" : value}
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick access */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--text-primary)" }}>Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

    </div>
  );
}
