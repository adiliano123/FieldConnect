import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "../components/AuthGuard";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "FieldConnect — Find Field & Internship Opportunities",
    template: "%s | FieldConnect",
  },
  description:
    "FieldConnect connects students with companies offering field training, internships, attachments and volunteer opportunities.",
  keywords: ["internship", "field training", "attachment", "student opportunities", "FieldConnect"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthGuard />
        {children}
      </body>
    </html>
  );
}
