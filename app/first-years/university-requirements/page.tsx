import Link from "next/link";
import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import styles from "../page.module.css";

export default function GraduationRequirements() {
  return (
    <>
      <Header />
      <ChatBot />

      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Graduation Requirements</h1>
            <p className={styles.subtitle}>
              Essential videos to understand your degree requirements
            </p>
            <Link href="/first-years" className={styles.backLink}>
              &larr; Back to First Year Guide
            </Link>
          </div>

          <div className={styles.videoSection}>
            <div className={styles.videoContainer}>
              <h2 className={styles.videoTitle}>University Graduation Requirements</h2>
              <p className={styles.videoDescription}>
                This video explains the university&apos;s graduation requirements that all students must complete to earn their degree.
              </p>
              <div className={styles.videoWrapper}>
                <iframe
                  className={styles.video}
                  src="https://www.youtube.com/embed/pU5SzMZaq64"
                  title="CAS Graduation Requirements"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className={styles.videoContainer}>
              <h2 className={styles.videoTitle}>The Core Curriculum</h2>
              <p className={styles.videoDescription}>
                Discover the foundational courses that make up the university&apos;s core curriculum and how they contribute to your education.
              </p>
              <div className={styles.videoWrapper}>
                <iframe
                  className={styles.video}
                  src="https://www.youtube.com/embed/aNisgRLwo0M"
                  title="The Core Curriculum"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}