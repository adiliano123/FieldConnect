"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard",     label: "Dashboard",     icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11l8-8 8 8v7a1 1 0 0 1-1 1h-4v-5H7v5H3a1 1 0 0 1-1-1v-7z"/></svg> },
  { href: "/admin/students",      label: "Students",      icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 0 0-.788 0l-7 3a1 1 0 0 0 0 1.84L5.25 8.051a.999.999 0 0 1 .356-.257l4-1.714a1 1 0 1 1 .788 1.838L7.667 9.088l1.94.831a1 1 0 0 0 .787 0l7-3a1 1 0 0 0 0-1.838l-7-3z"/></svg> },
  { href: "/admin/companies",     label: "Companies",     icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/></svg> },
  { href: "/admin/opportunities", label: "Opportunities", icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1zM4 8h12v8H4V8z" clipRule="evenodd"/></svg> },
  { href: "/admin/applications",  label: "Applications",  icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 0 0 0 2h2a1 1 0 1 0 0-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 0 1 2-2 3 3 0 0 0 3 3h2a3 3 0 0 0 3-3 2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm3 4a1 1 0 0 0 0 2h.01a1 1 0 1 0 0-2H7zm3 0a1 1 0 0 0 0 2h3a1 1 0 1 0 0-2h-3zm-3 4a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H7zm3 0a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3z" clipRule="evenodd"/></svg> },
  { href: "/admin/payments",      label: "Payments",      icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 0 0-2 2v1h16V6a2 2 0 0 0-2-2H4z"/><path fillRule="evenodd" d="M18 9H2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM4 13a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zm5-1a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2H9z" clipRule="evenodd"/></svg> },
  { href: "/admin/notifications", label: "Notifications", icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6zM10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z"/></svg> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 flex flex-col h-full"
      style={{
        background: "#0f172a",
        borderRight: "3px solid #ffc107",
      }}
    >
      <div className="px-5 pt-6 pb-2">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ffc107" }}>
          Admin Panel
        </p>
      </div>

      <nav className="flex flex-col gap-1 px-3 pb-4">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
              style={{
                background:  active ? "#1e3a5f"               : "transparent",
                color:       active ? "#fff"                   : "rgba(255,255,255,0.6)",
                borderLeft:  active ? "3px solid #ffc107"      : "3px solid transparent",
                marginLeft:  "-3px",
                fontWeight:  active ? 700 : 400,
              }}>
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                style={{
                  background: active ? "#ffc107"              : "rgba(255,255,255,0.08)",
                  color:      active ? "#1a1a1a"              : "rgba(255,255,255,0.5)",
                }}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-xl p-4"
          style={{ background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.2)" }}>
          <p className="text-xs font-bold" style={{ color: "#ffc107" }}>⚡ Admin Access</p>
          <p className="mt-1 text-xs leading-5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Full platform oversight and management.
          </p>
        </div>
      </div>
    </aside>
  );
}
