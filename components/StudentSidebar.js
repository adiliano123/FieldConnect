"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/student/dashboard",     label: "Dashboard",       icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11l8-8 8 8v7a1 1 0 0 1-1 1h-4v-5H7v5H3a1 1 0 0 1-1-1v-7z"/></svg> },
  { href: "/student/opportunities", label: "Opportunities",   icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM2 8a6 6 0 1 1 10.89 3.476l4.817 4.817a1 1 0 0 1-1.414 1.414l-4.816-4.816A6 6 0 0 1 2 8z" clipRule="evenodd"/></svg> },
  { href: "/student/applications",  label: "My Applications", icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 0 0 0 2h2a1 1 0 1 0 0-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 0 1 2-2 3 3 0 0 0 3 3h2a3 3 0 0 0 3-3 2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm3 4a1 1 0 0 0 0 2h.01a1 1 0 1 0 0-2H7zm3 0a1 1 0 0 0 0 2h3a1 1 0 1 0 0-2h-3zm-3 4a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H7zm3 0a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3z" clipRule="evenodd"/></svg> },
  { href: "/student/notifications", label: "Notifications",   icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6zM10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z"/></svg> },
  { href: "/student/profile",       label: "My Profile",      icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0H3z" clipRule="evenodd"/></svg> },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 flex flex-col h-full" style={{ background: "#0f172a", borderRight: "3px solid #ffc107" }}>

      <div className="px-5 pt-6 pb-2">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ffc107" }}>
          Student Portal
        </p>
      </div>

      <nav className="flex flex-col gap-1 px-3 pb-4">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
              style={{
                background: active ? "#1e3a5f"              : "transparent",
                color:      active ? "#fff"                  : "rgba(255,255,255,0.6)",
                borderLeft: active ? "3px solid #ffc107"     : "3px solid transparent",
                marginLeft: "-3px",
                fontWeight: active ? 700 : 400,
              }}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                style={{
                  background: active ? "#ffc107"             : "rgba(255,255,255,0.08)",
                  color:      active ? "#1a1a1a"             : "rgba(255,255,255,0.5)",
                }}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-xl p-4" style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}>
          <p className="text-xs font-bold" style={{ color: "#ffc107" }}>🎓 Student Portal</p>
          <p className="mt-1 text-xs leading-5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Browse opportunities and build your career today.
          </p>
        </div>
      </div>
    </aside>
  );
}
