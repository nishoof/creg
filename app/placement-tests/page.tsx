"use client";

import { authenticate, AuthenticatedUser } from '@/auth';
import { getUserData } from '@/functions/db';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import formStyles from '../form.module.css';

async function getMajor(authenticatedUser: AuthenticatedUser) {
  const username = authenticatedUser.email.split('@')[0];
  const userdata = await getUserData(username);
  return userdata.major;
}

export default function PlacementTests() {
  // Page title and description
  const pageTitle = "Placement Tests";
  const pageDescription = "Take your placement tests then enter your test results to see your recommended courses";

  // State for placement test scores
  const [csPlacementTestScore, setCsPlacementTestScore] = useState<number | null>(null);
  const [mathPlacementTestScore, setMathPlacementTestScore] = useState<number | null>(null);
  const [languagePlacementTestName, setLanguagePlacementTestName] = useState<string | null>(null);
  const [languagePlacementTestScore, setLanguagePlacementTestScore] = useState<number | null>(null);

  // Auth
  const { data: session } = useSession();
  const authenticatedUser = authenticate(session);
  const loggedIn = authenticatedUser !== false;

  // Get user's major from db (needs to be in a useEffect since it is async in a client component)
  const [major, setMajor] = useState<string | undefined>(undefined);
  useEffect(() => {
    async function updateMajor() {
      if (!loggedIn)
        return;

      const major = await getMajor(authenticatedUser);
      setMajor(major);
    }

    updateMajor();
  }, [loggedIn]);

  // If the user is not logged in, show a message to log in
  if (!loggedIn) {
    return (
      <div className="page">
        <main className="main">
          <div className="titleSection">
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>
          <p>Please log in to enter your placement tests.</p>
        </main>
      </div>
    );
  }

  // If the user has not selected a major, show a message to select a major
  if (!major) {
    return (
      <div className="page">
        <main className="main">
          <div className="titleSection">
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>
          <p>Please select your major on the <Link className="link" href="/account">Account page</Link> to enter your placement tests.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </div>

        <h2>Take Your Placement Tests</h2>
        <p>To take your placement tests, visit the USF website: <Link href="https://myusf.usfca.edu/newstudentregistration/placement-tests" className="link" target="_blank" rel="noopener noreferrer">Placement Tests at USF</Link></p>
        <p>Your major: <strong>{major}</strong></p>

        <h2>Enter Your Placement Test Scores</h2>
        <div className={formStyles.form}>
          <div className={formStyles.inputGroup}>
            <label htmlFor="csPlacement">Computer Science Placement Test Score:</label>
            <input
              type="number"
              id="csPlacement"
              value={csPlacementTestScore ?? ''}
              onChange={(e) => setCsPlacementTestScore(e.target.value ? parseInt(e.target.value) : null)}
              className={formStyles.input}
              min={0}
              max={100}
              placeholder="Enter your CS Placement Test score"
            />
          </div>

          <div className={formStyles.inputGroup}>
            <label htmlFor="mathPlacement">Math Placement Test Score:</label>
            <input
              type="number"
              id="mathPlacement"
              value={mathPlacementTestScore ?? ''}
              onChange={(e) => setMathPlacementTestScore(e.target.value ? parseInt(e.target.value) : null)}
              className={formStyles.input}
              min={0}
              max={100}
              placeholder="Enter your Math Placement Test score"
            />
          </div>

          <div className={formStyles.inputGroup}>
            <label htmlFor="languagePlacement">Language Placement Test Score:</label>
            <div style={{ display: "flex", gap: "1em", flexDirection: "row" }}>
              <select
                id="languagePlacement"
                value={languagePlacementTestName ?? ''}
                onChange={(e) => setLanguagePlacementTestName(e.target.value || null)}
                className={formStyles.input}
              >
                <option value="">Select a language</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
              </select>
              <input
                type="number"
                id="languagePlacement"
                value={languagePlacementTestScore ?? ''}
                onChange={(e) => setLanguagePlacementTestScore(e.target.value ? parseInt(e.target.value) : null)}
                className={formStyles.input}
                min={0}
                max={100}
                placeholder="Enter your Language Placement Test score"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
