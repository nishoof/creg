"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

export function Header() {
  const router = useRouter();
  const username = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src="/craigFull.png"
          alt="Logo"
          width={41}
          height={61}
          style={{ marginRight: "10px" }}
        />
      </Link>

      <Link href="/" className={styles.logo}>
        creg
      </Link>

      <nav className={styles.nav}>
        <Link href="/first-years" className={styles.navButton}>
          First Year Information
        </Link>

        <Link href="/register-landing-page" className={styles.navButton}>
          Course Registration
        </Link>

        <Link href="/ap-credit" className={styles.navButton}>
          AP Credit
        </Link>

        <Link href="/placement-tests" className={styles.navButton}>
          Placement Tests
        </Link>

        {/* Login / Logout */}
        {username ? (
          <Link href="/" onClick={handleLogout} className={styles.navButton}>
            Logout
          </Link>
        ) : (
          <Link href="/login" className={styles.navButton}>
            Login
          </Link>
        )}

        {/* Username (only shown if logged in)  */}
        {username && <span className={styles.username}>{username}</span>}
      </nav>
    </header>
  );
}
