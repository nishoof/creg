import Link from "next/link";
import styles from "./page.module.css";
import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <Header />

      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Welcome to creg</h1>
            <p className={styles.subtitle}>
              Your central hub for all course registration needs
            </p>
            <div className={styles.ctas}>
              <Link href="/first-years" className={styles.primaryCta}>
                First Year Guide
              </Link>
              <Link href="/register" className={styles.secondaryCta}>
                Register for Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}