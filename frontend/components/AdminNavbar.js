"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

const NAV_LINKS = [
  { href: "/admin/dashboard",       label: "Dashboard"     },
  { href: "/admin/students",        label: "Students"      },
  { href: "/admin/companies",       label: "Companies"     },
  { href: "/admin/opportunities",   label: "Opportunities" },
  { href: "/admin/applications",    label: "Applications"  },
  { href: "/admin/payments",        label: "Payments"      },
];

export default function AdminNavbar() {
  const router   = useRouter();
  const pathname = usePathname();

  const [user, setUser]         = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread]     = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Poll unread admin notifications every 30s
  useEffect(() => {
    const fetchCount = () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      fetch(`${API_URL}/admin/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => setUnread(Number(d.count) || 0))
        .catch(() => {});
    };
    fetchCount();
    const iv = setInterval(fetchCount, 30000);
    return () => clearInterval(iv);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #155724 100%)",
          boxShadow: "0 2px 12px rgba(15,23,42,0.4)",
        }}>
        <div className="page-container flex h-16 items-center justify-between">

          {/* Logo + badge */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FieldConnect" className="h-10 w-auto" />
            <span className="rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={{ background: "#ffc107", color: "#1a1a1a" }}>Admin</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
                  style={{
                    color:      active ? "#fff"                   : "rgba(255,255,255,0.65)",
                    background: active ? "rgba(255,255,255,0.15)" : "transparent",
                  }}>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">

            {/* 🔔 Bell icon */}
            <Link href="/admin/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg transition hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.12)" }}
              aria-label="Admin notifications">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="white">
                <path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6zM10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z"/>
              </svg>
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold animate-pulse"
                  style={{ background: "#ffc107", color: "#1a1a1a" }}>
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>

            {/* Avatar */}
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition hover:opacity-90"
                style={{ background: "#ffe8a1", color: "#155724" }}
                aria-label="Admin menu">
                {user?.name ? user.name[0].toUpperCase() : "A"}
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                  <div className="animate-scale-in absolute right-0 top-full z-40 mt-2 w-52 rounded-xl border bg-white p-1 shadow-lg"
                    style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}>
                    <div className="border-b px-3 py-2" style={{ borderColor: "var(--border)" }}>
                      <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {user?.name || "Admin"}
                      </p>
                      <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>{user?.email || ""}</p>
                    </div>
                    <Link href="/admin/notifications" onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-gray-50"
                      style={{ color: "var(--text-secondary)" }}>
                      🔔 Notifications {unread > 0 && <span className="ml-auto badge" style={{ background: "#ffc107", color: "#1a1a1a" }}>{unread}</span>}
                    </Link>
                    <button onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-red-50"
                      style={{ color: "#b91c1c" }}>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
              style={{ background: "rgba(255,255,255,0.12)" }}
              onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
              {mobileOpen
                ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2"><path d="M1 1l16 16M17 1 1 17"/></svg>
                : <svg width="18" height="18" viewBox="0 0 18 18" fill="white"><rect y="2" width="18" height="2" rx="1"/><rect y="8" width="18" height="2" rx="1"/><rect y="14" width="18" height="2" rx="1"/></svg>
              }
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="sticky top-16 z-30 md:hidden"
          style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <nav className="page-container flex flex-col py-2">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                className="rounded-lg px-3 py-3 text-sm font-medium transition"
                style={{ color: "rgba(255,255,255,0.9)", background: pathname === href ? "rgba(255,255,255,0.12)" : "transparent" }}>
                {label}
              </Link>
            ))}
            <Link href="/admin/notifications"
              className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.9)" }}>
              Notifications
              {unread > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ background: "#ffc107", color: "#1a1a1a" }}>{unread}</span>
              )}
            </Link>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
            <button onClick={handleLogout} className="flex items-center rounded-lg px-3 py-3 text-sm font-medium"
              style={{ color: "#fca5a5" }}>Sign Out</button>
          </nav>
        </div>
      )}
    </>
  );
}
