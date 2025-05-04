import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default async function Home() {
  // const session = await auth();
  // console.log("session:", session);

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
            <Link href="/first-year-info" className={styles.primaryCta}>
              First Year Guide
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
