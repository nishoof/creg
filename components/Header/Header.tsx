import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import Account from "./Account";

export function Header() {
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
        <Link href="/first-year-info" className={styles.navButton}>
          First Year Information
        </Link>

        <Link href="/ap-tests" className={styles.navButton}>
          AP Credit
        </Link>

        <Link href="/placement-tests" className={styles.navButton}>
          Placement Tests
        </Link>

        <Link href="/course-recommendations" className={styles.navButton}>
          Course Recommendations
        </Link>

        <Account />
      </nav>
    </header>
  );
}
