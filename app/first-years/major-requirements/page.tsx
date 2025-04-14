import Link from "next/link";
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";
import styles from "../page.module.css";

export default function MajorRequirements() {
  return (
    <>
      <Header />
      <ChatBot />

      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Major Requirements</h1>
            <p className={styles.subtitle}>
              Essential videos to understand your major-specific requirements.
              <br></br>Remember which placement tests you need to take!
            </p>
            <Link href="/first-years" className={styles.backLink}>
              &larr; Back to First Year Guide
            </Link>

          </div>

          <div className={styles.majorSection}>
            <h2>Select your major to watch your major-specific video:</h2>

            <ul className={styles.majorList}>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/Yrbj5ilS9ro" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Accounting</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://www.youtube.com/watch?v=-xu4FN1csPw" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Advertising</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/CxeQB-MyO8Y" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Asian Studies</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/m075Kctv9Gg" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Architecture</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/FK5CjHk0Tbo" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Biology</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://www.youtube.com/watch?v=3sUDzwGaPrY" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Chemistry</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://www.youtube.com/watch?v=Nrrz92sU314" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Computer Science</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/mrinjBbrSNU" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Data Science</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/qAm2T9_WDdY" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Design</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/rwIgWzZ9TpY" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Engineering</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/-TRooFEBiNc" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Mathematics</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/JM4nn-_r_g0" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Physics</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/un0ua791UGs" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Psychology</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/RdohQKNGIPo" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Undeclared Business</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/Ybo3qd0pijI" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Undeclared Arts</span>
                </Link>
              </li>

              <li className={styles.majorItem}>
                <Link href="https://youtu.be/E-nxzZ8IzfI" target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                  <span className={styles.majorName}>Undeclared Science</span>
                </Link>
              </li>

            </ul>

          </div>

        </div>
      </div >
    </>
  );
}