"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readCustomerSession } from "@/lib/customer-session";

export default function CustomerAccountLink({ onClick }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sync = () => setSession(readCustomerSession());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("customer-session-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("customer-session-changed", sync);
    };
  }, []);

  return (
    <Link className="account-nav-link" href={session ? "/account" : "/login"} onClick={onClick}>
      {session ? "Tài khoản" : "Đăng nhập"}
    </Link>
  );
}
