/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

const NAV_LINKS = [
  { href: "/company/dashboard",     label: "Dashboard"     },
  { href: "/company/opportunities", label: "Opportunities" },
  { href: "/company/applications",  label: "Applications"  },
  { href: "/company/profile",       label: "Profile"       },
];

export default function CompanyNavbar() {
  const router   = useRouter();
  const pathname = usePathname();

  const [user, setUser]             = useState(null);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setUser(JSON.parse(stored));
    // eslint-disable-next-line react-hooks/immutability
    fetchPending();
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const fetchPending = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res  = await fetch(`${API_URL}/applications/company`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      const list = data.applications ?? data.data ?? [];
      setPendingCount(list.filter((a) => a.status === "pending").length);
    } catch { /* silent */ }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "CO";

  return (
    <>
      <header className="sticky top-0 z-40"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #155724 100%)",
          boxShadow: "0 2px 12px rgba(15,23,42,0.4)",
        }}>
        <div className="page-container flex h-16 items-center justify-between">

          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="FieldConnect" className="h-10 w-auto" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className="relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
                  style={{
                    color:      active ? "#fff"                   : "rgba(255,255,255,0.65)",
                    background: active ? "rgba(255,255,255,0.15)" : "transparent",
                  }}>
                  {label}
                  {label === "Applications" && pendingCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: "#ffc107", color: "#1a1a1a" }}>
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition hover:opacity-90"
                style={{ background: "#ffe8a1", color: "#155724" }} aria-label="User menu">
                {initials}
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                  <div className="animate-scale-in absolute right-0 top-full z-40 mt-2 w-52 rounded-xl border bg-white p-1 shadow-lg"
                    style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}>
                    <div className="border-b px-3 py-2" style={{ borderColor: "var(--border)" }}>
                      <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{user?.name || "Company"}</p>
                      <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>{user?.email || ""}</p>
                    </div>
                    <Link href="/company/profile" onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-gray-50"
                      style={{ color: "var(--text-secondary)" }}>Company Profile</Link>
                    <button onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-red-50"
                      style={{ color: "#b91c1c" }}>Sign Out</button>
                  </div>
                </>
              )}
            </div>

            <button className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
              style={{ background: "rgba(255,255,255,0.12)" }}
              onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
              {mobileOpen
                ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2"><path d="M1 1l16 16M17 1 1 17"/></svg>
                : <svg width="18" height="18" viewBox="0 0 18 18" fill="white"><rect y="2" width="18" height="2" rx="1"/><rect y="8" width="18" height="2" rx="1"/><rect y="14" width="18" height="2" rx="1"/></svg>}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="sticky top-16 z-30 md:hidden"
          style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <nav className="page-container flex flex-col py-2">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition"
                style={{ color: "rgba(255,255,255,0.9)", background: pathname === href ? "rgba(255,255,255,0.12)" : "transparent" }}>
                {label}
                {label === "Applications" && pendingCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ background: "#ffc107", color: "#1a1a1a" }}>
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </Link>
            ))}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
            <button onClick={handleLogout} className="flex items-center rounded-lg px-3 py-3 text-sm font-medium"
              style={{ color: "#fca5a5" }}>Sign Out</button>
          </nav>
        </div>
      )}
    </>
  );
}
