"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Pages that don't need a token
const PUBLIC_PATHS = ["/", "/login", "/register"];

export default function AuthGuard() {
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip for public pages
    if (PUBLIC_PATHS.includes(pathname)) return;

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    // Decode JWT payload (no verification — just expiry check)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now     = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      }
    } catch {
      // Malformed token — clear and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [pathname, router]);

  return null; // renders nothing
}
