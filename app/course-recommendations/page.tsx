import { auth, authenticate, getUsername } from "@/auth";
import { Course } from "@/components/Course";
import { getApCredit, PlacementTest, Test } from "@/functions/credit";
import { getUserData } from "@/functions/db";
import { getCSMathRec, getCSRec } from "@/functions/recommender";
import styles from "./page.module.css";

export default async function Recommendations() {
  // Make sure user is logged in
  const session = await auth();
  const authenticatedUser = authenticate(session);
  const loggedIn = authenticatedUser !== false;

  // If the user is not logged in, show a message to log in
  if (!loggedIn) {
    return (
      <div className="page">
        <main className="main">
          <div className="titleSection">
            <h1>Course Recommendations</h1>
            <p>Please log in to see your recommendations.</p>
          </div>
        </main>
      </div>
    );
  }

  // Get userdata from database
  const username = getUsername(authenticatedUser);
  const userdata = await getUserData(username);

  // Calculate credits
  const credits = getApCredit(userdata.apTests);
  const csPlacement = userdata.placementTests.find(test => test.testName === PlacementTest.CSPlacement)?.testScore || 0;
  const mathPlacement = userdata.placementTests.find(test => test.testName === PlacementTest.MathPlacement)?.testScore || 0;

  // Get personalized recommendations
  const csRecommendation = getCSRec(credits, csPlacement);
  const csMathRecommendation = getCSMathRec(credits, mathPlacement);

  // Make ap tests list to show on the page
  const apTests = userdata.apTests.map((test: Test) => (
    <li key={test.testName}>
      {test.testName}: {test.testScore}
    </li>
  ));

  // Make placement tests list to show on the page
  const placementTests = userdata.placementTests.map((test: Test) => (
    <li key={test.testName}>
      {test.testName}: {test.testScore}
    </li>
  ));

  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>Course Recommendations</h1>
          <p>Find the best courses for you based on your placement tests and AP tests!</p>
        </div>

        <div>
          <h2>Welcome, {authenticatedUser.name}!</h2>
          <p>Email: {authenticatedUser.email}</p>
          {/* TODO: Get user's major, replace this placeholder */}
          <p>Major: Computer Science</p>
        </div>

        <div>
          <h2>Your Recommendations</h2>

          {/* Previous code, gets the personalized recommendation */}

          {/* {recommendation ? (
            <p>We recommend you take: {recommendation}.</p>
          ) : recommendation === undefined ? (
            <p>Loading recommendations...</p>
          ) : (
            <p>No recommendations available.</p>
          )} */}

          <div className={styles.grid}>

            {/* AP & Placement Test Scores */}
            <div className={styles.card}>
              <div className={`${styles.cardSection} ${styles.cardHeaderGreen}`}>
                <h3>Tests on Record</h3>
                <p>AP & Placement Test scores</p>
              </div>
              <div className={styles.cardSection}>
                <h4>AP Tests</h4>
                <ul className={styles.unstyledList}>
                  {apTests.length > 0 ? (
                    apTests
                  ) : (
                    <li>No AP tests found.</li>
                  )}
                </ul>

                <h4>Placement Tests</h4>
                <ul className={styles.unstyledList}>
                  {placementTests.length > 0 ? (
                    placementTests
                  ) : (
                    <li>No Placement tests found.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Core Curriculum */}
            <div className={styles.card}>
              <div className={`${styles.cardSection} ${styles.cardHeaderBlue}`}>
                <h3>Core Curriculum</h3>
                <p>USF Core requirements (44 units total)</p>
              </div>
              <div className={styles.cardSection}>
                <ul className={styles.unstyledList}>
                  <li>Area A - Foundations of Communication (8 units)</li>
                  <li>Area B - Mathematics and the Sciences (8 units)</li>
                  <li>Area C - Humanities (8 units)</li>
                  <li>Area D - Philosophy, Theology, and Ethics (12 units)</li>
                  <li>Area E - Social Sciences (4 units)</li>
                  <li>Area F - Visual and Performing Arts (4 units)</li>
                </ul>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className={styles.card}>
              <div className={`${styles.cardSection} ${styles.cardHeaderYellow}`}>
                <h3>Recommended Courses</h3>
                <p>Your personalized course plan</p>
              </div>
              <div className={styles.cardSection}>
                {(csRecommendation || csMathRecommendation) && <> {/* Only show this if there is a recommendation to show */}
                  <h4>Major Courses</h4>
                  <ul className={styles.unstyledList}>
                    {csRecommendation && <li><Course courseCode={csRecommendation} /></li>}
                    {csMathRecommendation && <li><Course courseCode={csMathRecommendation} /></li>}
                  </ul>
                </>}

                <h4>Core Courses</h4>
                <ul className={styles.unstyledList}>
                  <li><Course courseCode="RHET 103" /></li>
                  <li><Course courseCode="RHET 120" /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
