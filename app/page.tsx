import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Header />
      <ChatBot />

      <div className={styles.heroSection}>
        <Image
          src="/USFCABackground.jpg"
          alt="Background"
          className={styles.heroImage}
          width={1920}
          height={1080}
          priority
        />

        <div className={styles.heroOverlay}>
          <div className={styles.heroOverlay}>
            <div className={styles.container}>
              <div className={styles.main}>
                <div className={styles.hero}>
                  <h1 className={`${styles.title} ${styles.animateFadeDrop} ${styles["delay-1"]}`}>
                    Welcome to creg
                  </h1>
                  <p className={`${styles.subtitle} ${styles.animateFadeDrop} ${styles["delay-2"]}`}>
                    Your central hub for all course registration needs
                  </p>
                  <div className={styles.ctas}>
                    <Link href="/first-years" className={styles.primaryCta}>
                      First Year Guide
                    </Link>
                    <Link href="/register-landing-page" className={styles.secondaryCta}>
                      Register for Courses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}