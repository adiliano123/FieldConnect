/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col" style={{ minHeight: "100dvh", color: "var(--text-primary)", background: "#fff" }}>

      {/* ── Navbar ─────────────────────────── */}
      <header className="sticky top-0 z-40"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #155724 100%)",
          boxShadow: "0 2px 12px rgba(15,23,42,0.4)",
        }}>
        <div className="page-container flex h-16 items-center justify-between">
          <Link href="/"><img src="/icon.png" alt="FieldConnect" className="h-10 w-auto" /></Link>

          <nav className="hidden items-center gap-1 md:flex">
            <a href="#how-it-works" className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition-all"
              style={{ color: "rgba(255,255,255,0.75)" }}>How It Works</a>
            <a href="#stats" className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition-all"
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

      {/* ── Hero ───────────────────────────── */}
      <section className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #f0faf3 0%, #fffbeb 50%, #ffffff 100%)" }}>
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #28a745, transparent 70%)" }} />
        <div className="pointer-events-none absolute top-40 -left-32 h-72 w-72 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #ffc107, transparent 70%)" }} />

        <div className="page-container relative grid items-center gap-12 py-16 md:grid-cols-2">
          {/* Left */}
          <div className="animate-fade-in">
            <span className="badge badge-green mb-4">🎓 Field &amp; Internship Opportunities</span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl" style={{ color: "#0f172a" }}>
              Launch Your Career
              <span className="block mt-1" style={{ color: "#28a745" }}>With the Right Opportunity</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed" style={{ color: "#374151" }}>
              FieldConnect bridges students with organisations offering field training,
              internships, attachments, and volunteer opportunities.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register" className="rounded-xl px-6 py-3 text-sm font-bold text-white transition"
                style={{ background: "linear-gradient(135deg,#155724,#28a745)", boxShadow: "0 4px 14px rgba(40,167,69,0.35)" }}>
                Find Opportunities →
              </Link>
              <Link href="/login" className="rounded-xl px-6 py-3 text-sm font-semibold transition"
                style={{ background: "#fff", color: "#0f172a", border: "2px solid #e5e7eb" }}>
                Log In
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[{ num: "500+", label: "Opportunities" }, { num: "100+", label: "Organisations" }, { num: "1,000+", label: "Students" }].map(({ num, label }) => (
                <div key={label}>
                  <p className="text-xl font-bold" style={{ color: "#28a745" }}>{num}</p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — card */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative rounded-2xl p-7 text-white"
              style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 55%,#155724 100%)", boxShadow: "0 20px 40px -12px rgba(15,23,42,0.4)" }}>
              <div className="pointer-events-none absolute -top-3 -right-3 h-16 w-16 rounded-full border-4"
                style={{ borderColor: "rgba(255,193,7,0.3)" }} />
              <span className="inline-block rounded-full px-3 py-1 text-xs font-bold mb-4"
                style={{ background: "#ffc107", color: "#1a1a1a" }}>✨ For Students</span>
              <h2 className="text-xl font-bold leading-snug">Build your career with the right opportunity.</h2>
              <p className="mt-2 text-sm leading-6" style={{ color: "rgba(255,255,255,0.65)" }}>
                Apply directly, track everything from one dashboard.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {[{ icon: "🔎", label: "Search & Filter" }, { icon: "📝", label: "Easy Apply" }, { icon: "📊", label: "Track Status" }, { icon: "🔔", label: "Notifications" }].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 rounded-xl p-2.5"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span>{icon}</span>
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 h-1 w-12 rounded-full" style={{ background: "#ffc107" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────── */}
      <section id="how-it-works" className="py-14" style={{ background: "#f9fafb" }}>
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-2"
              style={{ background: "#ffe8a1", color: "#7c5c00" }}>Simple Process</span>
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "#0f172a" }}>How FieldConnect Works</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", icon: "🔎", title: "Find",    color: "#28a745", body: "Search hundreds of opportunities with smart filters." },
              { step: "02", icon: "📝", title: "Apply",   color: "#e0a800", body: "Submit your cover letter directly to organisations." },
              { step: "03", icon: "🎯", title: "Connect", color: "#1e3a5f", body: "Track applications and get notified on every update." },
            ].map(({ step, icon, title, color, body }) => (
              <div key={step} className="card card-hover rounded-2xl p-6" style={{ borderTop: `4px solid ${color}` }}>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: `${color}18`, color }}>Step {step}</span>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: `${color}15` }}>{icon}</div>
                <h3 className="mt-4 text-lg font-bold" style={{ color: "#0f172a" }}>{title}</h3>
                <p className="mt-1 text-sm leading-6" style={{ color: "#374151" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────── */}
      <section id="stats" className="py-12">
        <div className="page-container">
          <div className="grid gap-0 rounded-2xl overflow-hidden md:grid-cols-3"
            style={{ boxShadow: "0 12px 30px -8px rgba(15,23,42,0.2)" }}>
            {[
              { num: "500+",   label: "Active Opportunities", sub: "Updated weekly",      bg: "linear-gradient(135deg,#155724,#28a745)" },
              { num: "100+",   label: "Partner Organisations", sub: "Across all sectors", bg: "linear-gradient(135deg,#7c5c00,#e0a800)" },
              { num: "1,000+", label: "Students Placed",       sub: "Since launch",       bg: "linear-gradient(135deg,#0f172a,#1e3a5f)" },
            ].map(({ num, label, sub, bg }) => (
              <div key={label} className="text-center py-8 px-6 text-white" style={{ background: bg }}>
                <p className="text-3xl font-bold">{num}</p>
                <p className="mt-1 font-semibold">{label}</p>
                <p className="mt-0.5 text-xs opacity-70">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────── */}
      <section className="py-14 has-fixed-footer" style={{ background: "#f9fafb" }}>
        <div className="page-container">
          <div className="relative overflow-hidden rounded-2xl px-8 py-14 text-center"
            style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#155724 100%)" }}>
            <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full"
              style={{ background: "rgba(255,193,7,0.07)" }} />
            <span className="inline-block rounded-full px-4 py-1 text-sm font-bold mb-4"
              style={{ background: "#ffc107", color: "#1a1a1a" }}>🚀 Free to Join</span>
            <h2 className="text-2xl font-bold text-white md:text-3xl">Ready to find your opportunity?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6" style={{ color: "rgba(255,255,255,0.6)" }}>
              Join thousands of students using FieldConnect to discover opportunities that build real careers.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register" className="rounded-xl px-7 py-3 text-sm font-bold transition"
                style={{ background: "#ffc107", color: "#1a1a1a", boxShadow: "0 4px 14px rgba(255,193,7,0.35)" }}>
                Create Free Account
              </Link>
              <Link href="/login" className="rounded-xl px-7 py-3 text-sm font-semibold transition"
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)" }}>
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────── */}
      <footer className="footer-fixed" style={{ background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="page-container flex flex-col items-center justify-between gap-3 py-2 text-sm md:flex-row"
          style={{ color: "rgba(255,255,255,0.45)" }}>
          <Link href="/"><img src="/icon.png" alt="FieldConnect" className="h-8 w-auto" /></Link>
          <p>© 2026 FieldConnect. All rights reserved.</p>
          <p style={{ color: "#ffc107" }}>Bridging Talent &amp; Opportunities</p>
        </div>
      </footer>

    </main>
  );
}
