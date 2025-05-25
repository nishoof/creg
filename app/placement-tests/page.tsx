"use client";

import { authenticate } from '@/auth';
import { addPlacementTests, getUserData, UserInterface } from '@/functions/db';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';
import formStyles from '../form.module.css';

export default function PlacementTests() {
  // Page title and description
  const pageTitle = "Placement Tests";
  const pageDescription = "Take your placement tests then enter your test results to see your recommended courses";

  // State for placement test scores and success message
  const [csPlacementTestScore, setCsPlacementTestScore] = useState<number | null>(null);
  const [mathPlacementTestScore, setMathPlacementTestScore] = useState<number | null>(null);
  const [languagePlacementTestName, setLanguagePlacementTestName] = useState<string | null>(null);
  const [languagePlacementTestScore, setLanguagePlacementTestScore] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auth
  const { data: session } = useSession();
  const authenticatedUser = authenticate(session);
  const loggedIn = authenticatedUser !== false;
  const username = loggedIn ? authenticatedUser.email.split('@')[0] : "";

  /** Helper function, returns the best language test score from the given userdata */
  function getBestLanguageTest(userdata: UserInterface) {
    // Find the language placement test with the highest score
    const languageTests = userdata.placementTests.filter(test => test.testName.endsWith("LanguagePlacementTest"));
    if (languageTests.length === 0) return null;

    // Sort by score in descending order and return the first one
    const bestTest = languageTests.sort((a, b) => b.testScore - a.testScore)[0];
    return { name: bestTest.testName.replace("LanguagePlacementTest", ""), score: bestTest.testScore };
  }

  // Get user's major from db (needs to be in a useEffect since it is async in a client component)
  // Also get initial placement test scores
  const [major, setMajor] = useState<string | null | undefined>(undefined); // undefined means loading, null means no major selected
  useEffect(() => {
    async function updateMajorAndTestScores() {
      if (!loggedIn) {
        setMajor(null);
        return;
      }

      // Get userdata from the database
      const userdata = await getUserData(username);

      // Update major
      const major = userdata.major;
      setMajor(major);

      // Get placement test scores
      const csPlacementTest = userdata.placementTests.find(test => test.testName === "CSPlacementTest");
      const mathPlacementTest = userdata.placementTests.find(test => test.testName === "MathPlacementTest");
      const languagePlacementTest = getBestLanguageTest(userdata);

      // Update state with the scores
      setCsPlacementTestScore(csPlacementTest ? csPlacementTest.testScore : null);
      setMathPlacementTestScore(mathPlacementTest ? mathPlacementTest.testScore : null);
      setLanguagePlacementTestName(languagePlacementTest ? languagePlacementTest.name : null);
      setLanguagePlacementTestScore(languagePlacementTest ? languagePlacementTest.score : null);
    }

    updateMajorAndTestScores();
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

  // If the major is still loading, show a loading message
  if (major === undefined) {
    return (
      <div className="page">
        <main className="main">
          <div className="titleSection">
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>
          <p>Loading your major and placement test scores...</p>
        </main>
      </div>
    );
  }

  // If the user has not selected a major, show a message to select a major
  if (major == null) {
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

  /** Helper function, saves the user's inputted placement tests to the database */
  async function savePlacementTests() {
    if (!loggedIn) {
      alert("You must be logged in to save your placement test scores.");
      return;
    }

    let tests = [];
    if (csPlacementTestScore !== null) {
      tests.push({ testName: "CSPlacementTest", testScore: csPlacementTestScore });
    }
    if (mathPlacementTestScore !== null) {
      tests.push({ testName: "MathPlacementTest", testScore: mathPlacementTestScore });
    }
    if (languagePlacementTestName && languagePlacementTestScore !== null) {
      tests.push({ testName: `${languagePlacementTestName}LanguagePlacementTest`, testScore: languagePlacementTestScore });
    }

    if (tests.length === 0) {
      alert("Please enter at least one placement test score.");
      return;
    }

    await addPlacementTests(username, tests);

    setSuccessMessage("Placement test scores saved successfully!");
  }

  /** Helper function, validates test score and updates the relevant state */
  function handleTestScoreChange(event: ChangeEvent<HTMLInputElement>): void {
    const val = event.target.value;

    // If the input is empty, set the state to null and return early
    if (val === "") {
      console.log(`Clearing score for ${event.target.id}`);

      switch (event.target.id) {
        case "csPlacement":
          setCsPlacementTestScore(null);
          break;
        case "mathPlacement":
          setMathPlacementTestScore(null);
          break;
        case "languagePlacementScore":
          setLanguagePlacementTestScore(null);
          break;
        default:
          console.warn("Unknown input field ID:", event.target.id);
      }
      return;
    }

    // Validate the input to ensure it's a number between 0 and 100
    let numericValue = Number(val);
    console.log(`Val: ${val}, Numeric Value: ${numericValue}`);
    if (numericValue < 0) {
      numericValue = 0;
    }
    if (numericValue > 100) {
      numericValue = 100;
    }

    // Update the input value to the validated number
    event.target.value = numericValue.toString();

    // Update the relevant state based on the input field ID
    switch (event.target.id) {
      case "csPlacement":
        setCsPlacementTestScore(numericValue);
        break;
      case "mathPlacement":
        setMathPlacementTestScore(numericValue);
        break;
      case "languagePlacementScore":
        setLanguagePlacementTestScore(numericValue);
        break;
      default:
        console.warn("Unknown input field ID:", event.target.id);
    }
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
              onChange={handleTestScoreChange}
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
              onChange={handleTestScoreChange}
              className={formStyles.input}
              min={0}
              max={100}
              placeholder="Enter your Math Placement Test score"
            />
          </div>

          <div className={formStyles.inputGroup}>
            <div style={{ display: "flex", gap: "1em", flexDirection: "row" }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="languagePlacementName">Language Name:</label>
                <select
                  id="languagePlacementName"
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
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="languagePlacementScore">Language Placement Test Score:</label>
                <input
                  type="number"
                  id="languagePlacementScore"
                  value={languagePlacementTestScore ?? ''}
                  onChange={handleTestScoreChange}
                  className={formStyles.input}
                  min={0}
                  max={100}
                  placeholder="Enter your Language Placement Test score"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Button to save the tests to the user's account */}
        <button onClick={savePlacementTests} className={formStyles.button}>
          Save Placement Test Scores
        </button>

        {/* Success message after saving the tests */}
        {successMessage &&
          <div className="successMessage">
            {successMessage}
          </div>
        }
      </main>
    </div>
  );
}
