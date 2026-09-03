const nodemailer = require("nodemailer");

// ── Transporter ──────────────────────────────────────────
const transporter = nodemailer.createTransport({
    host:   "smtp.gmail.com",
    port:   465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ── Base template ─────────────────────────────────────────
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>FieldConnect</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #155724 0%, #28a745 100%); padding: 32px 40px; text-align: center; }
    .header h1 { color: #fff; font-size: 22px; font-weight: 700; margin-top: 12px; }
    .header p { color: #a7f3c0; font-size: 13px; margin-top: 4px; letter-spacing: 0.05em; text-transform: uppercase; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 20px; font-weight: 700; color: #111827; }
    .text { font-size: 15px; color: #374151; line-height: 1.7; margin-top: 12px; }
    .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
    .card-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .card-row:last-child { border-bottom: none; }
    .card-row .label { color: #6b7280; }
    .card-row .value { color: #111827; font-weight: 600; text-align: right; }
    .btn { display: inline-block; background: #28a745; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; margin-top: 8px; }
    .btn-center { text-align: center; margin: 24px 0; }
    .badge { display: inline-block; padding: 4px 14px; border-radius: 99px; font-size: 13px; font-weight: 700; }
    .badge-green  { background: #dcfce7; color: #15803d; }
    .badge-red    { background: #fee2e2; color: #b91c1c; }
    .badge-yellow { background: #fef9c3; color: #854d0e; }
    .badge-blue   { background: #dbeafe; color: #1e40af; }
    .divider { height: 1px; background: #e5e7eb; margin: 24px 0; }
    .footer { background: #f9fafb; padding: 20px 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    .footer a { color: #28a745; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div style="font-size:36px;">🎓</div>
      <h1>FieldConnect</h1>
      <p>Bridging Talent &amp; Opportunities</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© 2026 FieldConnect. All rights reserved.</p>
      <p style="margin-top:6px;">You are receiving this email because you have an account on FieldConnect.</p>
    </div>
  </div>
</body>
</html>
`;

// ── Send helper ───────────────────────────────────────────
const sendMail = async ({ to, subject, html }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
        process.env.EMAIL_USER === "your-gmail@gmail.com") {
        console.log(`[Email skipped — no credentials] To: ${to} | Subject: ${subject}`);
        return;
    }
    try {
        await transporter.sendMail({
            from:    process.env.EMAIL_FROM || `FieldConnect <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`[Email sent] To: ${to} | Subject: ${subject}`);
    } catch (err) {
        console.error(`[Email error] ${err.message}`);
    }
};

// ── 1. Application Submitted ──────────────────────────────
const sendApplicationSubmitted = async ({ studentName, studentEmail, opportunityTitle, companyName, type }) => {
    const html = baseTemplate(`
        <p class="greeting">Hi ${studentName} 👋</p>
        <p class="text">
            Your application has been submitted successfully. The organisation will review it and get back to you.
        </p>

        <div class="card">
            <div class="card-row"><span class="label">Opportunity</span><span class="value">${opportunityTitle}</span></div>
            <div class="card-row"><span class="label">Organisation</span><span class="value">${companyName}</span></div>
            <div class="card-row"><span class="label">Type</span><span class="value" style="text-transform:capitalize">${type}</span></div>
            <div class="card-row"><span class="label">Status</span><span class="value"><span class="badge badge-yellow">Pending Review</span></span></div>
        </div>

        <p class="text">
            We'll notify you by email as soon as there's an update on your application.
            You can also track it in your dashboard.
        </p>

        <div class="btn-center">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/student/applications" class="btn">
                View My Applications →
            </a>
        </div>
    `);

    await sendMail({
        to:      studentEmail,
        subject: `✅ Application Submitted — ${opportunityTitle}`,
        html,
    });
};

// ── 2. Application Accepted ───────────────────────────────
const sendApplicationAccepted = async ({ studentName, studentEmail, opportunityTitle, companyName, type, applicationId }) => {
    const feeMap = { internship: 25000, attachment: 25000, field: 10000, volunteer: 10000 };
    const fee    = feeMap[type?.toLowerCase()] ?? 25000;

    const html = baseTemplate(`
        <p class="greeting">Congratulations, ${studentName}! 🎉</p>
        <p class="text">
            Great news! Your application has been <strong>accepted</strong>.
            You have been selected for the following opportunity:
        </p>

        <div class="card">
            <div class="card-row"><span class="label">Opportunity</span><span class="value">${opportunityTitle}</span></div>
            <div class="card-row"><span class="label">Organisation</span><span class="value">${companyName}</span></div>
            <div class="card-row"><span class="label">Type</span><span class="value" style="text-transform:capitalize">${type}</span></div>
            <div class="card-row"><span class="label">Status</span><span class="value"><span class="badge badge-green">Accepted ✓</span></span></div>
        </div>

        <div class="divider"></div>

        <p class="text" style="font-weight:700; color:#111827;">⚠️ Next Step — Placement Fee</p>
        <p class="text">
            To confirm your placement, a one-time fee of <strong>TZS ${fee.toLocaleString()}</strong> is required.
            Please complete the payment to secure your spot.
        </p>

        <div class="btn-center">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/student/payment/${applicationId}" class="btn">
                Pay Now — TZS ${fee.toLocaleString()} →
            </a>
        </div>
    `);

    await sendMail({
        to:      studentEmail,
        subject: `🎉 Accepted! — ${opportunityTitle} at ${companyName}`,
        html,
    });
};

// ── 3. Application Rejected ───────────────────────────────
const sendApplicationRejected = async ({ studentName, studentEmail, opportunityTitle, companyName }) => {
    const html = baseTemplate(`
        <p class="greeting">Hi ${studentName},</p>
        <p class="text">
            Thank you for applying to <strong>${opportunityTitle}</strong> at <strong>${companyName}</strong>.
        </p>
        <p class="text">
            After careful consideration, the organisation has decided not to move forward with your application at this time.
            Don't be discouraged — there are many more opportunities available.
        </p>

        <div class="card">
            <div class="card-row"><span class="label">Opportunity</span><span class="value">${opportunityTitle}</span></div>
            <div class="card-row"><span class="label">Organisation</span><span class="value">${companyName}</span></div>
            <div class="card-row"><span class="label">Status</span><span class="value"><span class="badge badge-red">Not Selected</span></span></div>
        </div>

        <p class="text">
            Keep your profile updated and continue applying. We believe the right opportunity is out there for you.
        </p>

        <div class="btn-center">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/student/opportunities" class="btn">
                Browse More Opportunities →
            </a>
        </div>
    `);

    await sendMail({
        to:      studentEmail,
        subject: `Application Update — ${opportunityTitle}`,
        html,
    });
};

// ── 4. Application Under Review ───────────────────────────
const sendApplicationReviewing = async ({ studentName, studentEmail, opportunityTitle, companyName }) => {
    const html = baseTemplate(`
        <p class="greeting">Hi ${studentName},</p>
        <p class="text">
            Your application for <strong>${opportunityTitle}</strong> at <strong>${companyName}</strong>
            is now <strong>under review</strong>.
        </p>

        <div class="card">
            <div class="card-row"><span class="label">Opportunity</span><span class="value">${opportunityTitle}</span></div>
            <div class="card-row"><span class="label">Organisation</span><span class="value">${companyName}</span></div>
            <div class="card-row"><span class="label">Status</span><span class="value"><span class="badge badge-blue">Under Review</span></span></div>
        </div>

        <p class="text">
            The organisation is currently reviewing your application. We will notify you as soon as a decision is made.
        </p>

        <div class="btn-center">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/student/applications" class="btn">
                View My Applications →
            </a>
        </div>
    `);

    await sendMail({
        to:      studentEmail,
        subject: `Application Under Review — ${opportunityTitle}`,
        html,
    });
};

// ── 5. Payment Confirmed ──────────────────────────────────
const sendPaymentConfirmed = async ({ studentName, studentEmail, opportunityTitle, companyName, amount, txRef }) => {
    const html = baseTemplate(`
        <p class="greeting">Payment Confirmed! 💰</p>
        <p class="text">
            Hi ${studentName}, your placement fee has been received. Your placement is now officially confirmed.
        </p>

        <div class="card">
            <div class="card-row"><span class="label">Opportunity</span><span class="value">${opportunityTitle}</span></div>
            <div class="card-row"><span class="label">Organisation</span><span class="value">${companyName}</span></div>
            <div class="card-row"><span class="label">Amount Paid</span><span class="value">TZS ${Number(amount).toLocaleString()}</span></div>
            <div class="card-row"><span class="label">Reference</span><span class="value" style="font-size:12px;">${txRef}</span></div>
            <div class="card-row"><span class="label">Status</span><span class="value"><span class="badge badge-green">Placement Confirmed ✓</span></span></div>
        </div>

        <p class="text">
            Congratulations on securing your placement! Please keep this email as your payment receipt.
        </p>

        <div class="btn-center">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/student/applications" class="btn">
                View My Applications →
            </a>
        </div>
    `);

    await sendMail({
        to:      studentEmail,
        subject: `💰 Payment Confirmed — Your Placement is Secured!`,
        html,
    });
};

// ── 6. Welcome / Registration ─────────────────────────────
const sendWelcomeEmail = async ({ name, email, role }) => {
    const isStudent = role === "student";
    const html = baseTemplate(`
        <p class="greeting">Welcome to FieldConnect, ${name}! 🎉</p>
        <p class="text">
            Your account has been created successfully. You are registered as a
            <strong style="text-transform:capitalize">${role}</strong>.
        </p>

        <div class="card">
            <div class="card-row"><span class="label">Name</span><span class="value">${name}</span></div>
            <div class="card-row"><span class="label">Email</span><span class="value">${email}</span></div>
            <div class="card-row"><span class="label">Role</span><span class="value" style="text-transform:capitalize">${role}</span></div>
        </div>

        <p class="text">
            ${isStudent
                ? "Start exploring hundreds of field training, internship and volunteer opportunities available on the platform."
                : "Complete your company profile and start posting opportunities to attract talented students."
            }
        </p>

        <div class="btn-center">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="btn">
                ${isStudent ? "Browse Opportunities →" : "Go to Dashboard →"}
            </a>
        </div>
    `);

    await sendMail({
        to:      email,
        subject: `Welcome to FieldConnect, ${name}! 🎓`,
        html,
    });
};

module.exports = {
    sendApplicationSubmitted,
    sendApplicationAccepted,
    sendApplicationRejected,
    sendApplicationReviewing,
    sendPaymentConfirmed,
    sendWelcomeEmail,
};
