import { auth, authenticate } from '@/auth';
import { getUserData } from '@/functions/db';
import { getMajorVideo } from '@/functions/majors';
import Link from 'next/link';

export default async function MajorRequirements() {
  // Page title and description
  const pageTitle = "Major-Specific Graduation Requirements";
  const pageDescription = "Learn about the specific requirements and recommendations for your chosen major and see example schedules";

  // Auth
  const session = await auth();
  const authenticatedUser = authenticate(session);
  const loggedIn = authenticatedUser !== false;

  // Handle not logged in
  if (!loggedIn) {
    return (
      <div className="page">
        <main className="main">
          <div className="titleSection">
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>

          <p>Please log in and select your major to view this page.</p>
        </main>
      </div>
    );
  }

  // Get user's major
  const username = authenticatedUser.email.split('@')[0];
  const userdata = await getUserData(username);
  const major = userdata.major;

  // Handle no major selected
  if (!major) {
    return (
      <div className="page">
        <main className="main">
          <div className="titleSection">
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>

          <p>Please select your major on the <Link className="link" href="/account">Account page</Link> to view this page.</p>
        </main>
      </div>
    );
  }

  // Get video to display based on major
  const videoUrl = getMajorVideo(major);

  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </div>

        <h2>{major}</h2>

        <div className="videoWrapper">
          <iframe
            className="video"
            src={videoUrl}
            title="CAS Graduation Requirements"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </main>
    </div>
  );
}
