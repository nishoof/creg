import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
  return (
    <>
      <Image
        src="/USFCABackground.jpg"
        alt="Background"
        className="background"
        width={1920}
        height={1080}
        priority
      />

      <div className={styles.landingContainer}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to creg
          </h1>
          <p className={styles.subtitle}>
            Your central hub for all course registration needs
          </p>

          <div className={styles.ctas}>
            <Link href="/getting-started" className={styles.primaryCta}>
              Get Started
            </Link>
            <Link href="/course-recommendations" className={styles.secondaryCta}>
              Course Recommendations
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
