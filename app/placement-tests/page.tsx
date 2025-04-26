import Link from 'next/link';

export default function PlacementTests() {
  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>Placement Tests</h1>
          <p>Take your placement tests then enter your test results to see your recommended pathways</p>
        </div>

        <h2>Take Your Placement Tests</h2>
        <p>To take your placement tests, visit the USF website: <Link href="https://myusf.usfca.edu/newstudentregistration/placement-tests" className="link" target="_blank" rel="noopener noreferrer">Placement Tests at USF</Link></p>

        <h2>Pathways</h2>
        <p>See what courses you should take based on your placement test scores.</p>

        <h3>Select your major:</h3>

        <ul>
          <li><Link href="/placement-tests/cs-major">Computer Science</Link></li>
          <li><Link href="/placement-tests/chemistry-major">Chemistry</Link></li>
          <li><Link href="/placement-tests/other-major">Other</Link></li>
        </ul>
      </main>
    </div>
  );
}
