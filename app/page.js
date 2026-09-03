/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white" style={{ color: "var(--text-primary)" }}>

      {/* ── Navbar ─────────────────────────── */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-sm"
        style={{ borderColor: "var(--border)" }}>
        <div className="page-container flex h-16 items-center justify-between">
          <Link href="/">
            <img src="/logo.png" alt="FieldConnect" className="h-10 w-auto" />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#stats" className="nav-link">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost btn-sm">Log In</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────── */}
      <section className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, var(--brand-50) 0%, #f9fafb 60%, #ffffff 100%)" }}>
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #28a745, transparent 70%)" }} />
        <div className="pointer-events-none absolute top-40 -left-32 h-72 w-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #ffc107, transparent 70%)" }} />

        <div className="page-container relative grid items-center gap-14 py-24 md:grid-cols-2">
          <div className="animate-fade-in">
            <span className="badge badge-green mb-5">🎓 Field &amp; Internship Opportunities</span>
            <h1 className="text-5xl font-bold leading-[1.15] tracking-tight md:text-6xl" style={{ color: "var(--text-primary)" }}>
              Launch Your Career
              <span className="block mt-1" style={{ color: "var(--brand-600)" }}>With the Right Opportunity</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              FieldConnect bridges the gap between students and organisations offering field training,
              internships, attachments, and volunteer opportunities — all in one place.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-primary btn-lg">Find Opportunities →</Link>
              <Link href="/login" className="btn btn-ghost btn-lg">Log In</Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {[{ num: "500+", label: "Opportunities" }, { num: "100+", label: "Organisations" }, { num: "1 000+", label: "Students" }].map(({ num, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold" style={{ color: "var(--brand-600)" }}>{num}</p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feature card */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative rounded-3xl p-8 text-white"
              style={{ background: "linear-gradient(135deg, #1e7e34 0%, #28a745 55%, #48bb6e 100%)", boxShadow: "0 24px 48px -12px rgb(40 167 69 / .4)" }}>
              <div className="pointer-events-none absolute -top-6 -right-6 h-32 w-32 rounded-full border-4 border-white/10" />
              <h2 className="text-2xl font-bold leading-snug">Build your career with the right opportunity.</h2>
              <p className="mt-3 text-sm leading-6" style={{ color: "#a7f3c0" }}>
                Discover opportunities that match your field of study, apply directly,
                and track everything from one dashboard.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {[{ icon: "🔎", label: "Search & Filter" }, { icon: "📝", label: "Easy Apply" }, { icon: "📊", label: "Track Status" }, { icon: "🔔", label: "Notifications" }].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.12)" }}>
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────── */}
      <section id="how-it-works" className="py-24" style={{ background: "var(--surface-muted)" }}>
        <div className="page-container">
          <div className="text-center">
            <span className="section-eyebrow">Simple Process</span>
            <h2 className="text-3xl font-bold md:text-4xl" style={{ color: "var(--text-primary)" }}>How FieldConnect Works</h2>
            <p className="mx-auto mt-4 max-w-xl leading-7" style={{ color: "var(--text-secondary)" }}>
              Finding a field placement or internship should be straightforward. Here&apos;s how we make it happen.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { step: "01", icon: "🔎", title: "Find Opportunities", body: "Search through hundreds of field training, internship, attachment and volunteer openings with smart filters." },
              { step: "02", icon: "📝", title: "Apply Easily",        body: "Submit your application and cover letter directly to organisations — no unnecessary paperwork." },
              { step: "03", icon: "🎯", title: "Get Connected",       body: "Track your applications in real time and get notified when organisations respond." },
            ].map(({ step, icon, title, body }) => (
              <div key={step} className="card card-hover rounded-2xl p-8">
                <span className="rounded-xl px-2.5 py-1 text-xs font-bold" style={{ background: "var(--brand-50)", color: "var(--brand-700)" }}>{step}</span>
                <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ background: "var(--brand-50)" }}>{icon}</div>
                <h3 className="mt-5 text-xl font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
                <p className="mt-2 leading-7" style={{ color: "var(--text-secondary)" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────── */}
      <section id="stats" className="py-16">
        <div className="page-container">
          <div className="grid gap-8 rounded-3xl p-10 text-white md:grid-cols-3"
            style={{ background: "linear-gradient(135deg, #1e7e34 0%, #28a745 100%)", boxShadow: "var(--shadow-xl)" }}>
            {[
              { num: "500+", label: "Active Opportunities", sub: "Updated weekly" },
              { num: "100+", label: "Partner Organisations", sub: "Across all sectors" },
              { num: "1 000+", label: "Students Placed", sub: "Since launch" },
            ].map(({ num, label, sub }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-bold">{num}</p>
                <p className="mt-1 font-semibold">{label}</p>
                <p className="mt-1 text-sm" style={{ color: "#a7f3c0" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────── */}
      <section className="py-20" style={{ background: "var(--surface-muted)" }}>
        <div className="page-container">
          <div className="overflow-hidden rounded-3xl px-8 py-16 text-center"
            style={{ background: "linear-gradient(135deg, #0f2e1a 0%, #1e7e34 100%)" }}>
            <span className="badge badge-cream mb-5">🚀 Start Today</span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to find your opportunity?</h2>
            <p className="mx-auto mt-4 max-w-xl leading-7" style={{ color: "#a7f3c0" }}>
              Join thousands of students already using FieldConnect to discover and apply for opportunities that build real careers.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register" className="btn btn-accent btn-lg">Create Free Account</Link>
              <Link href="/login" className="btn btn-sm px-6 py-3 rounded-lg font-semibold"
                style={{ background: "rgba(255,255,255,0.08)", color: "#e2e8f0", border: "1.5px solid rgba(255,255,255,0.15)" }}>
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────── */}
      {/* ── Footer ─────────────────────────── */}
      <footer className="border-t py-8" style={{ borderColor: "var(--border)" }}>
        <div className="page-container flex flex-col items-center justify-between gap-3 text-sm md:flex-row"
          style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="FieldConnect" className="h-8 w-auto" />
          </Link>
          <p>© 2026 FieldConnect. All rights reserved.</p>
          <p>Connecting students with opportunities.</p>
        </div>
      </footer>

    </main>
  );
}
