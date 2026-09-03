"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

const TYPE_CONFIG = {
  student:     { icon: "🎓", label: "Student",     bg: "#f0faf3", color: "#1e7e34" },
  company:     { icon: "🏢", label: "Company",     bg: "#fffbeb", color: "#b38600" },
  opportunity: { icon: "📋", label: "Opportunity", bg: "#f0faf3", color: "#1e7e34" },
  application: { icon: "📝", label: "Application", bg: "#fffbeb", color: "#b38600" },
  payment:     { icon: "💰", label: "Payment",     bg: "#dcfce7", color: "#15803d" },
  system:      { icon: "⚙️", label: "System",      bg: "#f1f5f9", color: "#475569" },
};

function tc(type) { return TYPE_CONFIG[type?.toLowerCase()] ?? TYPE_CONFIG.system; }

function formatDate(raw) {
  if (!raw) return "";
  return new Date(raw).toLocaleString("en-TZ", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [filter, setFilter]       = useState("all");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    loadNotifications(token);
  }, [router]);

  const loadNotifications = async (token) => {
    try {
      setLoading(true); setError("");
      const res  = await fetch(`${API_URL}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setNotifications(data.notifications ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/admin/notifications/${id}/read`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((p) => p.map((n) => n.id === id ? { ...n, is_read: 1 } : n));
    } catch { /* silent */ }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    try {
      setMarkingAll(true);
      await fetch(`${API_URL}/admin/notifications/read-all`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((p) => p.map((n) => ({ ...n, is_read: 1 })));
    } catch { /* silent */ }
    finally { setMarkingAll(false); }
  };

  const unread  = notifications.filter((n) => Number(n.is_read) === 0);
  const read    = notifications.filter((n) => Number(n.is_read) === 1);

  const displayed = useMemo(() => {
    if (filter === "unread") return unread;
    if (filter === "read")   return read;
    return notifications;
  }, [notifications, filter, unread, read]);

  const FILTERS = [
    { key: "all",    label: "All",    count: notifications.length },
    { key: "unread", label: "Unread", count: unread.length        },
    { key: "read",   label: "Read",   count: read.length          },
  ];

  return (
    <div className="page-container py-8 md:py-10">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-in">
        <div>
          <span className="section-eyebrow">Admin</span>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Notifications</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Platform activity — registrations, applications, payments and more.
          </p>
        </div>
        {unread.length > 0 && (
          <button onClick={markAllAsRead} disabled={markingAll} className="btn btn-outline btn-sm shrink-0">
            {markingAll ? "Marking…" : "Mark all as read"}
          </button>
        )}
      </div>

      {/* Summary cards */}
      {!loading && !error && notifications.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3 animate-fade-in">
          {[
            { label: "Total",  value: notifications.length, icon: "🔔", bg: "var(--brand-50)",  color: "var(--brand-700)" },
            { label: "Unread", value: unread.length,        icon: "📬", bg: "var(--accent-100)", color: "var(--accent-700)" },
            { label: "Read",   value: read.length,          icon: "✅", bg: "#dcfce7",           color: "#15803d" },
          ].map(({ label, value, icon, bg, color }) => (
            <div key={label} className="card flex items-center gap-4 rounded-2xl p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{ background: bg, color }}>{icon}</span>
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unread banner */}
      {!loading && !error && unread.length > 0 && (
        <div className="alert alert-info mt-5 animate-fade-in">
          You have <strong>{unread.length}</strong> unread notification{unread.length > 1 ? "s" : ""}.
        </div>
      )}

      {/* Filter tabs */}
      {!loading && !error && notifications.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 animate-fade-in">
          {FILTERS.map(({ key, label, count }) => (
            <button key={key} onClick={() => setFilter(key)}
              className="badge cursor-pointer transition"
              style={{
                background: filter === key ? "var(--brand-600)" : "var(--surface-muted)",
                color:      filter === key ? "#fff"             : "var(--text-secondary)",
                border:     filter === key ? "1.5px solid var(--brand-600)" : "1.5px solid transparent",
                fontWeight: filter === key ? 700 : 500,
              }}>
              {label} · {count}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card rounded-2xl p-5 flex gap-4">
              <div className="skeleton h-12 w-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="skeleton h-4 w-48" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && <div className="alert alert-error mt-6">{error}</div>}

      {!loading && !error && notifications.length === 0 && (
        <div className="card mt-6 flex flex-col items-center rounded-2xl py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
            style={{ background: "var(--brand-50)" }}>🔔</div>
          <h2 className="mt-5 text-xl font-bold" style={{ color: "var(--text-primary)" }}>No Notifications</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Platform activity will appear here.
          </p>
        </div>
      )}

      {!loading && !error && displayed.length === 0 && notifications.length > 0 && (
        <div className="card mt-6 flex flex-col items-center rounded-2xl py-12 text-center">
          <span className="text-4xl">📭</span>
          <p className="mt-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}>No {filter} notifications.</p>
        </div>
      )}

      {/* List */}
      {!loading && !error && displayed.length > 0 && (
        <div className="mt-5 space-y-3 animate-fade-in">
          {displayed.map((n, i) => {
            const isUnread = Number(n.is_read) === 0;
            const t = tc(n.type);
            return (
              <div key={n.id} className="card rounded-2xl overflow-hidden transition"
                style={{
                  borderColor: isUnread ? "var(--brand-200)" : "var(--border)",
                  background:  isUnread ? "var(--brand-50)"  : "var(--surface)",
                  animationDelay: `${i * 0.03}s`,
                }}>
                <div className="flex gap-4 p-5">
                  {/* Icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{ background: isUnread ? t.bg : "var(--surface-muted)" }}>
                    {t.icon}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="font-semibold truncate"
                          style={{ color: isUnread ? "var(--text-primary)" : "var(--text-secondary)" }}>
                          {n.title}
                        </h3>
                        {isUnread && (
                          <span className="h-2 w-2 shrink-0 rounded-full"
                            style={{ background: "var(--brand-600)" }} />
                        )}
                      </div>
                      <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
                        {formatDate(n.created_at)}
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                      {n.message}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="badge text-xs capitalize" style={{ background: t.bg, color: t.color }}>
                        {t.icon} {t.label}
                      </span>
                      {n.link && (
                        <a href={n.link} className="text-xs font-semibold hover:underline"
                          style={{ color: "var(--brand-600)" }}>
                          View →
                        </a>
                      )}
                      {isUnread && (
                        <button onClick={() => markAsRead(n.id)}
                          className="text-xs font-semibold hover:underline"
                          style={{ color: "var(--brand-600)" }}>
                          Mark as read
                        </button>
                      )}
                      {!isUnread && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z" clipRule="evenodd"/>
                          </svg>
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
