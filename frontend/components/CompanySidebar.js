"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/company/dashboard",            label: "Dashboard",       icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11l8-8 8 8v7a1 1 0 0 1-1 1h-4v-5H7v5H3a1 1 0 0 1-1-1v-7z"/></svg> },
  { href: "/company/opportunities",         label: "Opportunities",   icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1zM4 8h12v8H4V8z" clipRule="evenodd"/></svg> },
  { href: "/company/opportunities/create",  label: "Post Opportunity", icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z" clipRule="evenodd"/></svg> },
  { href: "/company/applications",          label: "Applications",    icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM17 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 0 0-1.5-4.33A5 5 0 0 1 19 16v1h-6.07zM6 11a5 5 0 0 1 5 5v1H1v-1a5 5 0 0 1 5-5z"/></svg> },
  { href: "/company/profile",               label: "Company Profile", icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/></svg> },
];

export default function CompanySidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 flex flex-col h-full" style={{ background: "#0f172a", borderRight: "3px solid #ffc107" }}>

      <div className="px-5 pt-6 pb-2">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ffc107" }}>
          Company Portal
        </p>
      </div>

      <nav className="flex flex-col gap-1 px-3 pb-4">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
              style={{
                background: active ? "#1e3a5f"             : "transparent",
                color:      active ? "#fff"                 : "rgba(255,255,255,0.6)",
                borderLeft: active ? "3px solid #ffc107"   : "3px solid transparent",
                marginLeft: "-3px",
                fontWeight: active ? 700 : 400,
              }}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                style={{
                  background: active ? "#ffc107"           : "rgba(255,255,255,0.08)",
                  color:      active ? "#1a1a1a"           : "rgba(255,255,255,0.5)",
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
          <p className="text-xs font-bold" style={{ color: "#ffc107" }}>🏢 Company Portal</p>
          <p className="mt-1 text-xs leading-5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Post opportunities and connect with talented students.
          </p>
        </div>
      </div>
    </aside>
  );
}
