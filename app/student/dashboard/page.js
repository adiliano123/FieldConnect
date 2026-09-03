"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser]   = useState(null);
  const [stats, setStats] = useState({ opportunities: 0, applications: 0, notifications: 0 });

  useEffect(() => {
    const token      = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token) { router.push("/login"); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedUser) setUser(JSON.parse(storedUser));

    const headers = { Authorization: `Bearer ${token}` };
    Promise.allSettled([
      fetch(`${API_URL}/opportunities`,       { headers }).then((r) => r.json()),
      fetch(`${API_URL}/applications/my`,     { headers }).then((r) => r.json()),
      fetch(`${API_URL}/notifications`,       { headers }).then((r) => r.json()),
    ]).then(([opps, apps, notifs]) => {
      setStats({
        opportunities: opps.status === "fulfilled"
          ? (opps.value.opportunities ?? opps.value.data ?? []).length : 0,
        applications: apps.status === "fulfilled"
          ? (apps.value.applications ?? apps.value.data ?? []).length : 0,
        notifications: notifs.status === "fulfilled"
          ? (notifs.value.notifications ?? notifs.value.data ?? []).filter((n) => Number(n.is_read) === 0).length : 0,
      });
    });
  }, [router]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const statCards = [
    {
      label: "Available Opportunities",
      value: stats.opportunities,
      icon: (
        <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM2 8a6 6 0 1 1 10.89 3.476l4.817 4.817a1 1 0 0 1-1.414 1.414l-4.816-4.816A6 6 0 0 1 2 8z" clipRule="evenodd" />
        </svg>
      ),
      color: "#28a745", bg: "#f0faf3", href: "/student/opportunities",
    },
    {
      label: "My Applications",
      value: stats.applications,
      icon: (
        <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 0 0 0 2h2a1 1 0 1 0 0-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 0 1 2-2 3 3 0 0 0 3 3h2a3 3 0 0 0 3-3 2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm3 4a1 1 0 0 0 0 2h.01a1 1 0 1 0 0-2H7zm3 0a1 1 0 0 0 0 2h3a1 1 0 1 0 0-2h-3zm-3 4a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H7zm3 0a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3z" clipRule="evenodd" />
        </svg>
      ),
      color: "#e0a800", bg: "#fffbeb", href: "/student/applications",
    },
    {
      label: "Unread Notifications",
      value: stats.notifications,
      icon: (
        <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6zM10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z" />
        </svg>
      ),
      color: "#d97706", bg: "#fffbeb", href: "/student/notifications",
    },
  ];

  const quickLinks = [
    { href: "/student/opportunities", label: "Browse Opportunities", icon: "🔎", desc: "Search & filter open positions" },
    { href: "/student/applications",  label: "My Applications",      icon: "📝", desc: "Track your submitted applications" },
    { href: "/student/profile",       label: "Edit Profile",         icon: "👤", desc: "Keep your information up to date" },
  ];

  return (
    <div className="page-container py-8 md:py-10">

      {/* Welcome banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 text-white animate-fade-in"
        style={{
          background: "linear-gradient(135deg, #1e7e34 0%, #28a745 55%, #48bb6e 100%)",
          boxShadow: "0 8px 24px -6px rgba(40,167,69,0.3)",
        }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -right-4 bottom-0 h-32 w-32 rounded-full bg-white/5" />

        <p className="text-sm font-medium" style={{ color: "#a7f3c0" }}>{greeting()},</p>
        <h1 className="mt-1 text-3xl font-bold">{user?.name || "Student"} 👋</h1>
        <p className="mt-2 max-w-lg text-sm leading-6" style={{ color: "#d4f1dc" }}>
          Discover field training and internship opportunities that match your career goals.
          Your next big step starts here.
        </p>
        <Link
          href="/student/opportunities"
          className="btn mt-5 inline-flex"
          style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}
        >
          Browse Opportunities →
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {statCards.map(({ label, value, icon, color, bg, href }) => (
          <Link key={label} href={href} className="card card-hover flex items-center gap-4 rounded-2xl p-5 transition">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: bg, color }}>
              {icon}
            </span>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--text-primary)" }}>Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickLinks.map(({ href, label, icon, desc }) => (
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

      {/* Profile completion nudge */}
      <div
        className="card mt-8 flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
            style={{ background: "var(--brand-50)", color: "var(--brand-600)" }}
          >
            ✨
          </span>
          <div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Complete your profile</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              A complete profile increases your chances of getting selected.
            </p>
          </div>
        </div>
        <Link href="/student/profile" className="btn btn-outline btn-sm shrink-0">Update Profile</Link>
      </div>

    </div>
  );
}
