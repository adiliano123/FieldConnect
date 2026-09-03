# FieldConnect

> **Bridging Talent & Opportunities**

FieldConnect is a full-stack web platform that connects students with organisations offering field training, internships, attachments, and volunteer opportunities — all in one place.

---

## 📸 Overview

```
Student  →  Browse & Apply  →  Company Reviews  →  Accept/Reject
                                                         ↓
                                              Student Pays Placement Fee
                                                         ↓
                                              Placement Confirmed ✅
```

---

## 🚀 Features

### 👨‍🎓 Student Portal
- Register and manage a personal profile
- Browse and search opportunities by type, category, and location
- Apply with a cover letter
- Track application status in real time (Pending → Reviewing → Accepted/Rejected)
- Pay placement fee via Flutterwave (M-Pesa, Tigo, Airtel, Card)
- Receive email notifications at every step
- In-app notification inbox with unread badge

### 🏢 Company Portal
- Register and manage company profile
- Post, edit, and close opportunities (Field, Internship, Attachment, Volunteer)
- Review student applications with full cover letter view
- Accept, review, or reject applications
- Pending applications badge on navbar

### 🛡️ Admin Portal
- Full platform oversight dashboard
- Manage all students, companies, opportunities, applications
- Verify / unverify company accounts
- View all payments with revenue summary
- Real-time admin notification system (bell icon + notifications page)
- Notified on: new registrations, opportunities, applications, payments

### 💰 Payment System
| Opportunity Type | Fee (TZS) |
|---|---|
| Field Training | 10,000 |
| Volunteer | 10,000 |
| Internship | 25,000 |
| Attachment | 25,000 |

Powered by **Flutterwave** — supports M-Pesa, Tigo Pesa, Airtel Money, Visa/Mastercard.

### 📧 Email Notifications
Students receive emails for:
- Welcome on registration
- Application submitted confirmation
- Application under review
- Application accepted (with Pay Now link)
- Application rejected
- Payment receipt / placement confirmation

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Auth | JWT (JSON Web Tokens) |
| Payments | Flutterwave |
| Email | Nodemailer (Gmail SMTP) |
| Hosting | — |

---

## 📁 Project Structure

```
FieldConnect/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/             # Database connection
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth & role middleware
│   │   ├── models/             # MySQL queries
│   │   ├── routes/             # API routes
│   │   └── services/           # Business logic
│   ├── server.js
│   └── package.json
│
├── frontend/                   # Next.js application
│   ├── app/
│   │   ├── admin/              # Admin pages
│   │   ├── company/            # Company pages
│   │   ├── student/            # Student pages
│   │   ├── login/
│   │   ├── register/
│   │   └── page.js             # Landing page
│   ├── components/             # Shared navbar & sidebar components
│   ├── lib/                    # API helper
│   └── public/                 # Logo & favicon
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MySQL (XAMPP recommended)
- Git

---

### 1. Clone the repository

```bash
git clone https://github.com/adiliano123/FieldConnect.git
cd FieldConnect
```

---

### 2. Database Setup

1. Start **XAMPP** and turn on **MySQL**
2. Open **phpMyAdmin** → create a database named `fieldconnect`
3. Run the following SQL to create tables:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','company','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  university VARCHAR(150) NOT NULL,
  course VARCHAR(150) NOT NULL,
  year_of_study INT,
  phone VARCHAR(20),
  location VARCHAR(100),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  description TEXT,
  phone VARCHAR(20),
  location VARCHAR(100),
  website VARCHAR(255),
  is_verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE opportunities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  type ENUM('field','internship','attachment','volunteer') NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  requirements TEXT,
  positions INT DEFAULT 1,
  deadline DATE NOT NULL,
  status ENUM('open','closed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  opportunity_id INT NOT NULL,
  cover_letter TEXT,
  status ENUM('pending','reviewing','accepted','rejected') DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'system',
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE admin_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'system',
  is_read TINYINT(1) DEFAULT 0,
  link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  student_id INT NOT NULL,
  opportunity_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'TZS',
  opportunity_type VARCHAR(50) NOT NULL,
  status ENUM('pending','completed','failed') DEFAULT 'pending',
  flw_tx_id VARCHAR(255),
  flw_tx_ref VARCHAR(255),
  tx_ref VARCHAR(255) NOT NULL,
  payment_method VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id)
);
```

4. Create the admin account:

```sql
-- Password is: admin123 (change this after first login)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@fieldconnect.com',
'$2b$10$d.iQ//QWdzCJ7hTo/kDbmuALhyiiye54.WCqZ4e564piWmQ5owT/a', 'admin');
```

---

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fieldconnect
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key

# Flutterwave — get from dashboard.flutterwave.com
FLW_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxx-X
FLW_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxx-X
FLW_ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

# Payment fees (TZS)
FEE_FIELD=10000
FEE_VOLUNTEER=10000
FEE_INTERNSHIP=25000
FEE_ATTACHMENT=25000

# URLs
APP_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Email — Gmail App Password (not your real password)
# Get from: Google Account → Security → 2-Step Verification → App Passwords
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=FieldConnect <your-gmail@gmail.com>
```

Start the backend:

```bash
node server.js
# or with auto-restart:
npx nodemon server.js
```

Backend runs at: `http://localhost:5000`

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` folder:

```env
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxx-X
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@fieldconnect.com | admin123 |

> Register new student and company accounts from the `/register` page.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |

### Student
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/profile` | Get student profile |
| PUT | `/api/students/profile` | Update student profile |

### Company
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/companies/profile` | Get company profile |
| PUT | `/api/companies/profile` | Update company profile |

### Opportunities
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/opportunities` | Get all open opportunities |
| GET | `/api/opportunities/:id` | Get one opportunity |
| GET | `/api/opportunities/company` | Get company's opportunities |
| POST | `/api/opportunities` | Create opportunity |
| PUT | `/api/opportunities/:id` | Update opportunity |
| DELETE | `/api/opportunities/:id` | Delete opportunity |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications` | Submit application |
| GET | `/api/applications/my-applications` | Student's applications |
| GET | `/api/applications/company` | Company's applications |
| PUT | `/api/applications/:id/status` | Update status |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/payments/fees` | Get fee table |
| POST | `/api/payments/initialize` | Start payment |
| POST | `/api/payments/verify` | Verify payment |
| GET | `/api/payments/my` | Student's payments |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/students` | All students |
| GET | `/api/admin/companies` | All companies |
| PUT | `/api/admin/companies/:id/verify` | Verify company |
| GET | `/api/admin/opportunities` | All opportunities |
| GET | `/api/admin/applications` | All applications |
| GET | `/api/admin/payments` | All payments |
| GET | `/api/admin/notifications` | Admin notifications |

---

## 🎨 Design System

| Token | Color | Usage |
|---|---|---|
| Brand (Primary) | `#28A745` Eucalyptus Green | Buttons, active states, links |
| Accent | `#FFC107` Amber Yellow | Badges, highlights |
| Soft Accent | `#FFE8A1` Cream Brulee | Admin accents, avatars |
| Navbar / Sidebar | `#0f172a` Dark Navy | All portal headers |

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Adiliano** — [github.com/adiliano123](https://github.com/adiliano123)

---

*FieldConnect — Bridging Talent & Opportunities* 🎓
