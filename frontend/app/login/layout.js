import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>

      {/* ── Navbar ── */}
      <header className="shrink-0 sticky top-0 z-40"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #155724 100%)",
          boxShadow: "0 2px 12px rgba(15,23,42,0.4)",
        }}>
        <div className="page-container flex h-16 items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Link href="/"><img src="/icon.png" alt="FieldConnect" className="h-10 w-auto" /></Link>
          <nav className="hidden items-center gap-1 md:flex">
            <a href="/#how-it-works" className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition-all"
              style={{ color: "rgba(255,255,255,0.75)" }}>How It Works</a>
            <a href="/#stats" className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition-all"
              style={{ color: "rgba(255,255,255,0.75)" }}>About</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(255,255,255,0.25)" }}>Log In</Link>
            <Link href="/register" className="rounded-lg px-4 py-2 text-sm font-bold transition"
              style={{ background: "#ffc107", color: "#1a1a1a" }}>Get Started</Link>
          </div>
        </div>
      </header>

      {/* ── Page content — scrollable ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </div>

      {/* ── Footer — fixed to bottom ── */}
      <footer className="footer-fixed" style={{ background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="page-container flex flex-col items-center justify-between gap-3 py-2 text-sm md:flex-row"
          style={{ color: "rgba(255,255,255,0.45)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Link href="/"><img src="/icon.png" alt="FieldConnect" className="h-8 w-auto" /></Link>
          <p>© 2026 FieldConnect. All rights reserved.</p>
          <p style={{ color: "#ffc107" }}>Bridging Talent &amp; Opportunities</p>
        </div>
      </footer>

    </div>
  );
}
