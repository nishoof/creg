import { auth, authenticate } from "@/auth";
import { getCourseRecommendations } from "@/functions/recommender";

export default async function Recommendations() {
  // Make sure user is logged in
  const session = await auth();
  const authenticatedUser = authenticate(session);
  const loggedIn = authenticatedUser !== false;

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

  const { name, email } = authenticatedUser;

  const recommendation = getCourseRecommendations(email);

  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>Course Recommendations</h1>
          <p>Find the best courses for you based on your placement tests and AP tests!</p>
        </div>

        <div>
          <h2>Welcome, {name}!</h2>
          <p>Your email: {email}</p>
        </div>

        <div>
          <h2>Your Recommendations</h2>
          {recommendation ? (
            <p>We recommend you take: {recommendation}</p>
          ) : (
            <p>No recommendations available yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
