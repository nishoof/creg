import Link from "next/link";
import styles from "./page.module.css";

export default function GettingStarted() {
  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>Getting Started</h1>
          <p>Everything you need to know to start your journey at USF</p>
        </div>

        <h2>Step 1: Make your creg account</h2>
        <div className={styles.infoGrid}>
          <div className="infoCard">
            <h3>Sign In Using Google</h3>
            <p>Click Sign In in the top right and sign in using your <strong>@dons.usfca.edu</strong> email. This makes your creg account where you can save all your info to.</p>
          </div>
          <div className="infoCard">
            <h3>Select Your Major</h3>
            <p>Go to the Account page and enter your major. This lets us choose the correct information to show you!</p>
            <Link className="link" href="/account">Account page</Link>
          </div>
        </div>

        <h2>Step 2: Watch Videos and Mark Your Calendar</h2>
        <div className={styles.infoGrid}>
          <div className="infoCard">
            <h3>University Graduation Requirements Videos</h3>
            <p>Watch two short videos on the graduation requirements and core curriculum.</p>
            <Link className="link" href="/university-requirements">Watch Videos</Link>
          </div>
          <div className="infoCard">
            <h3>Major-Specific Graduation Requirements Video</h3>
            <p>Learn about the specific requirements and recommendations for your chosen major and see example schedules.</p>
            <Link className="link" href="/major-requirements">Watch Video</Link>
          </div>
          <div className="infoCard">
            <h3>Important Dates and Deadlines</h3>
            <p>Mark your calendar with registration periods, add/drop deadlines, and academic calendar milestones.</p>
            <Link className="link" href="https://www.usfca.edu/academic-calendar">View Academic Calendar</Link>
            <Link className="link" href="https://calendar.google.com/calendar/embed?src=c_c5edbe80c4f6a6772124a4608179aadc4f6518061082ad43ec02538c13c8e54a%40group.calendar.google.com&ctz=America%2FLos_Angeles">Add Google Calendar</Link>
          </div>
        </div>

        <h2>Step 3: Testing</h2>
        <div className={styles.infoGrid}>
          <div className="infoCard">
            <h3>Placement Tests</h3>
            <p>Complete your placement tests and add scores to your creg account.</p>
            <Link className="link" href="/placement-tests">View Placement Tests</Link>
          </div>
          <div className="infoCard">
            <h3>AP Tests</h3>
            <p>Check which of your AP Tests can get you course credit at USF and add it to your account.</p>
            <Link className="link" href="/ap-tests">Check AP Tests</Link>
          </div>
        </div>

        <h2>Step 4: See Your Course Recommendations</h2>
        <div className={styles.infoGrid}>
          <div className="infoCard">
            <h3>Course Recommendations</h3>
            <p>See what classes you should take based on your placement test results and the AP tests you have taken.</p>
            <Link className="link" href="/course-recommendations">View Recommendations</Link>
            {/* TODO: make page with recommendations and update this link ^ */}
          </div>
        </div>
      </main >
    </div >
  );
}
