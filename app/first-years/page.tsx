import Link from "next/link";
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";
import styles from "./page.module.css";

export default function FirstYears() {
  return (
    <>
      <Header />
      <ChatBot />

      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.hero}>
            <h1 className={styles.title}>First Year Student Guide</h1>
            <p className={styles.subtitle}>
              Everything you need to know to start your journey at USF
            </p>
          </div>

          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Step 1: Watch Videos and Mark Your Calendar</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3>Watch the University Graduation Requirements videos</h3>
                <p>Watch two short videos on the graduation requirements and core curriculum.</p>
                <Link href="/first-years/university-requirements" className={styles.cardLink}>Watch Video</Link>
              </div>

              <div className={styles.infoCard}>
                <h3>Watch Your Major-Specific Graduation Requirements Video</h3>
                <p>Learn about the specific requirements and recommendations for your chosen major and see example schedules.</p>
                <Link href="/first-years/major-requirements" className={styles.cardLink}>Watch Video</Link>
              </div>

              <div className={styles.infoCard}>
                <h3>Important Dates</h3>
                <p>Mark your calendar with registration periods, add/drop deadlines, and academic calendar milestones.</p>
                <Link href="https://www.usfca.edu/academic-calendar" className={styles.cardLink} target="_blank" rel="noopener noreferrer">View Academic Calendar</Link>
                <Link href="https://calendar.google.com/calendar/embed?src=c_c5edbe80c4f6a6772124a4608179aadc4f6518061082ad43ec02538c13c8e54a%40group.calendar.google.com&ctz=America%2FLos_Angeles" className={styles.cardLink} target="_blank" rel="noopener noreferrer">Add Google Calendar</Link>
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Step 2: Testing</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3>Placement Tests</h3>
                <p>Complete the Directed Self-Placement (DSP) for Rhetoric and the other placement tests listed in your major-specific video. Add scores to your account.</p>
                <Link href="/placement-tests" className={styles.cardLink}>View Placement Tests</Link>
              </div>
              <div className={styles.infoCard}>
                <h3>AP Tests</h3>
                <p>Check which of your AP Tests can get you course credit at USF and add it to your account.</p>
                <Link href="/ap-credit" className={styles.cardLink}>Check AP Tests</Link>
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Step 3: See Your Course Recommendations</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3>Course Recommendations</h3>
                <p>See what classes you should take based on your placement test results and the AP tests you have taken.</p>
                <Link href="/register-landing-page/recommendations" className={styles.cardLink}>View Course Recommendations</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}