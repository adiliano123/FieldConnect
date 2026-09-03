import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--background)" }}
    >
      {/* Big number */}
      <div
        className="text-[8rem] font-bold leading-none"
        style={{
          background: "linear-gradient(135deg, var(--brand-600), var(--accent-500))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </div>

      <h1 className="mt-4 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
        Page not found
      </h1>
      <p className="mt-3 max-w-sm leading-7" style={{ color: "var(--text-secondary)" }}>
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn btn-primary btn-lg">
          Go Home
        </Link>
        <Link href="/login" className="btn btn-ghost btn-lg">
          Log In
        </Link>
      </div>

      {/* Decorative card */}
      <div
        className="card mt-12 flex max-w-sm flex-col items-center gap-3 rounded-2xl p-6"
      >
        <span className="text-4xl">🔎</span>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Looking for opportunities?
        </p>
        <Link href="/register" className="btn btn-primary btn-sm">
          Create an Account
        </Link>
      </div>
    </div>
  );
}
