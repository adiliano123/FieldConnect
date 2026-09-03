"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_URL  = "http://localhost:5000/api";
const FLW_KEY  = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "FLWPUBK_TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXX-X";

const TYPE_LABELS = {
  field:      "Field Training",
  internship: "Internship",
  attachment: "Attachment",
  volunteer:  "Volunteer",
};

const STATUS_STYLE = {
  completed: { bg: "#dcfce7", color: "#15803d", label: "Paid ✓" },
  pending:   { bg: "#fef9c3", color: "#854d0e", label: "Pending" },
  failed:    { bg: "#fee2e2", color: "#b91c1c", label: "Failed" },
};

export default function PaymentPage() {
  const { applicationId } = useParams();
  const router = useRouter();

  const [info, setInfo]         = useState(null);   // from /initialize
  const [payment, setPayment]   = useState(null);   // existing payment record
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [paying, setPaying]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const u     = localStorage.getItem("user");
    if (!token) { router.push("/login"); return; }
    if (u) setUser(JSON.parse(u));
    checkExistingAndInit(token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  // Handle Flutterwave redirect back with ?status=successful&tx_ref=...&transaction_id=...
  useEffect(() => {
    const params        = new URLSearchParams(window.location.search);
    const status        = params.get("status");
    const txRef         = params.get("tx_ref");
    const transactionId = params.get("transaction_id");
    if (status === "successful" && txRef && transactionId) {
      handleVerify(txRef, transactionId);
    } else if (status === "cancelled") {
      setError("Payment was cancelled.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkExistingAndInit = async (token) => {
    try {
      setLoading(true);
      // Check for existing payment
      const existRes = await fetch(`${API_URL}/payments/application/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (existRes.ok) {
        const existData = await existRes.json();
        if (existData.payment) {
          setPayment(existData.payment);
          if (existData.payment.status === "completed") { setLoading(false); return; }
        }
      }
      // Initialize new or reuse pending
      const res  = await fetch(`${API_URL}/payments/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ applicationId: Number(applicationId) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to initialize payment");
      setInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (txRef, transactionId) => {
    const token = localStorage.getItem("token");
    try {
      setPaying(true);
      const res  = await fetch(`${API_URL}/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tx_ref: txRef, transaction_id: transactionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      setSuccess("Payment confirmed! Your placement is now active.");
      setPayment((p) => ({ ...p, status: "completed" }));
      // Clear URL params
      window.history.replaceState({}, "", window.location.pathname);
    } catch (err) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  const handlePay = () => {
    if (!info) return;
    if (typeof window === "undefined" || !window.FlutterwaveCheckout) {
      setError("Payment gateway not loaded. Please refresh and try again.");
      return;
    }
    setPaying(true);
    window.FlutterwaveCheckout({
      public_key: FLW_KEY,
      tx_ref:     info.txRef,
      amount:     info.amount,
      currency:   "TZS",
      payment_options: "mobilemoneytanzania,card",
      customer: {
        email: user?.email || "student@fieldconnect.com",
        name:  user?.name  || "Student",
      },
      customizations: {
        title:       "FieldConnect Placement Fee",
        description: `${TYPE_LABELS[info.opportunityType] || info.opportunityType} — ${info.opportunityTitle}`,
        logo: "",
      },
      callback: (response) => {
        setPaying(false);
        if (response.status === "successful") {
          handleVerify(response.tx_ref, response.transaction_id);
        } else {
          setError("Payment was not completed. Please try again.");
        }
      },
      onclose: () => { setPaying(false); },
    });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="page-container py-10 space-y-4">
        <div className="skeleton h-6 w-40" />
        <div className="card rounded-2xl p-8 space-y-4">
          <div className="skeleton h-8 w-56" />
          <div className="skeleton h-32 w-full rounded-xl" />
          <div className="skeleton h-14 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  /* ── Already paid ── */
  if (payment?.status === "completed") {
    return (
      <div className="page-container py-10">
        <div className="card mx-auto max-w-lg rounded-2xl p-10 text-center animate-scale-in">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl"
            style={{ background: "#dcfce7" }}>✅</div>
          <h1 className="mt-5 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Payment Confirmed
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Your placement fee has been received. Your placement is now active.
          </p>
          <div className="mt-6 rounded-xl p-4 text-left space-y-2" style={{ background: "var(--surface-muted)" }}>
            {[
              { l: "Amount",   v: `TZS ${Number(payment.amount).toLocaleString()}` },
              { l: "Type",     v: TYPE_LABELS[payment.opportunity_type] || payment.opportunity_type },
              { l: "Ref",      v: payment.flw_tx_ref || payment.tx_ref },
              { l: "Method",   v: payment.payment_method || "—" },
            ].map(({ l, v }) => (
              <div key={l} className="flex justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>{l}</span>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{v}</span>
              </div>
            ))}
          </div>
          <Link href="/student/applications" className="btn btn-primary btn-lg mt-6 w-full">
            View My Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Load Flutterwave inline script */}
      <script src="https://checkout.flutterwave.com/v3.js" async />

      <div className="page-container py-8 md:py-10">
        <Link href="/student/applications"
          className="inline-flex items-center gap-1 text-sm font-semibold hover:underline"
          style={{ color: "var(--brand-600)" }}>
          ← Back to Applications
        </Link>

        <div className="mx-auto mt-6 max-w-lg animate-fade-in">
          <div className="card rounded-2xl overflow-hidden">

            {/* Header band */}
            <div className="p-6 text-white"
              style={{ background: "linear-gradient(135deg, #155724 0%, #28a745 100%)" }}>
              <p className="text-sm font-medium" style={{ color: "#a7f3c0" }}>Placement Fee</p>
              <h1 className="mt-1 text-3xl font-bold">
                TZS {info ? Number(info.amount).toLocaleString() : "—"}
              </h1>
              <p className="mt-1 text-sm" style={{ color: "#d4f1dc" }}>
                One-time fee for your placement confirmation
              </p>
            </div>

            <div className="p-6 space-y-5">

              {/* Opportunity details */}
              {info && (
                <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--surface-muted)" }}>
                  {[
                    { l: "Opportunity", v: info.opportunityTitle },
                    { l: "Organisation", v: info.companyName },
                    { l: "Type",   v: TYPE_LABELS[info.opportunityType] || info.opportunityType },
                    { l: "Amount", v: `TZS ${Number(info.amount).toLocaleString()}` },
                    { l: "Currency", v: "TZS (Tanzanian Shilling)" },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex justify-between text-sm">
                      <span style={{ color: "var(--text-muted)" }}>{l}</span>
                      <span className="font-semibold text-right max-w-[60%]" style={{ color: "var(--text-primary)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* What you get */}
              <div className="rounded-xl border p-4" style={{ borderColor: "var(--brand-200)", background: "var(--brand-50)" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--brand-700)" }}>
                  What this payment covers
                </p>
                {[
                  "Placement confirmation with the organisation",
                  "Official placement letter from FieldConnect",
                  "Access to student support during placement",
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--brand-600)" }}>✓</span> {item}
                  </p>
                ))}
              </div>

              {/* Accepted payment methods */}
              <div className="flex flex-wrap gap-2">
                {["M-Pesa", "Tigo Pesa", "Airtel Money", "Visa / Mastercard"].map((m) => (
                  <span key={m} className="badge badge-gray">{m}</span>
                ))}
              </div>

              {error   && <div className="alert alert-error animate-fade-in">{error}</div>}
              {success && <div className="alert alert-success animate-fade-in">{success}</div>}

              <button
                onClick={handlePay}
                disabled={paying || !info}
                className="btn btn-primary btn-lg w-full"
              >
                {paying ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3-3-3-3v4a8 8 0 1 0 8 8h-4l3 3 3-3h-4a8 8 0 0 1-8 8z"/>
                    </svg>
                    Processing…
                  </span>
                ) : `Pay TZS ${info ? Number(info.amount).toLocaleString() : "—"}`}
              </button>

              <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
                Secured by Flutterwave. Your payment is encrypted and safe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
