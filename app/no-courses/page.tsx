"use client";

import { useRouter } from "next/navigation";
import styles from "../login/page.module.css"; // reusing login styles
import { Header } from "@/components/Header";
import Image from "next/image";

export default function NoCourseDataPage() {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Image
          src="/USFCABackground.jpg"
          alt="Background"
          className={styles.heroImage}
          width={1920}
          height={1080}
          priority
        />
        <div className={styles.heroOverlay}></div>
        <div className={styles.loginForm}>
          <div className={styles.header}>
            <h1 className={styles.title}>No Course Data</h1>
            <p className={styles.subtitle}>You have no course data available.</p>
          </div>


          <button className={styles.button} onClick={goHome}>
            Return to Home
          </button>
        </div>
      </div>
    </>
  );
}
