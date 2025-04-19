import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import styles from "./page.module.css";
import Link from "next/link";

export default function Pathways() {
  return (
    <>
      <Header />
      <ChatBot />

      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Placement Tests</h1>
            <p className={styles.subtitle}>
              Take your placement tests then enter your test results to see your recommended pathways.
            </p>
          </div>

          <div className={styles.info} style={{ marginBottom: "30px" }}>
            <h2 style={{ marginBottom: "10px" }}>Take Your Placement Tests</h2>
            <p>
              To take your placement tests, visit the USF website: <Link href="https://myusf.usfca.edu/newstudentregistration/placement-tests" target="_blank" rel="noopener noreferrer" className={styles.link}>Placement Tests at USF</Link>
            </p>
          </div>


          <h2>Pathways</h2>

          <p>See what courses you should take based on your placement test scores.</p>

          <h3>Select your major:</h3>

          <ul className={styles.majorList} style={{ gridTemplateColumns: "repeat(1, 1fr)" }}>

            <li className={styles.majorItem}>
              <Link href="/placement-tests/cs-major" className={styles.majorLink}>
                <span className={styles.majorName}>Computer Science</span>
              </Link>
            </li>

            <li className={styles.majorItem}>
              <Link href="/placement-tests/chemistry-major" className={styles.majorLink}>
                <span className={styles.majorName}>Chemistry</span>
              </Link>
            </li>

            <li className={styles.majorItem}>
              <Link href="/placement-tests/other-major" className={styles.majorLink}>
                <span className={styles.majorName}>Other</span>
              </Link>
            </li>

          </ul>
        </div>
      </div >
    </>
  );
}