"use client";

import { ChangeEventHandler, useEffect, useState } from "react";
import { apTestCreditMap, apTests } from "./ap-credits";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";

// Determines the AP credit result based on the test's name and score
function determineCreditResult(testName: string, testScore: number) {
  if (!testName)
    throw new Error("Test name is required.");

  if (testScore < 1 || testScore > 5)
    throw new Error("Test score must be between 1 and 5.");

  const testCredit = apTestCreditMap[testName];
  if (!testCredit)
    throw new Error(`No credit mapping found for the test: ${testName}`);

  if (testScore < testCredit.score) {
    return `No credit, need a score of ${testCredit.score} or higher`;
  }

  if (testCredit.credit === "General Elective") {
    return "This counts as a General Elective";
  }

  // AP Biology has a special case for scores of 4 or 5
  if (testName === "AP Biology" && testScore === 5) {
    return `This counts as ${testCredit.credit}. You could also petition the Biology Chair to receive credit for BIOL 105-General Biology I (4 credits) and BIOL 106-General Biology II (4 credits) in place of credit for BIOL 100 and BIOL 103`;
  }

  return `This counts as ${testCredit.credit}`;
}

export default function APTests() {
  const { data: session } = useSession();
  console.log("session:", session);

  const [testName, setTestName] = useState<string>(apTests[0]);
  const [testScore, setTestScore] = useState<number>(1);
  const [earnedCredit, setEarnedCredit] = useState<string>("");

  // Update earnedCredit when the testName or testScore changes
  useEffect(() => {
    const result = determineCreditResult(testName, testScore);
    setEarnedCredit(result);
  }, [testName, testScore]);

  // Update the selected test name when the user selects a different test
  const handleTestNameChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setTestName(e.target.value);
  };

  // Update and validate the test score input when the user types in the input field
  const handleTestScoreChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const numericValue = Number(e.target.value);
    if (numericValue >= 1 && numericValue <= 5) {
      e.target.value = numericValue.toString();
      setTestScore(numericValue);
    } else if (e.target.value === "") {
      setTestScore(1);
    }
  };

  return (
    <div className="page">
      <main className="main">
        {/* Title and description section */}
        <div className="titleSection">
          <h1>AP Test Credit</h1>
          <p>Select your AP test and enter your score to see how much credit you earned</p>
        </div>

        {/* Form section for AP test selection and score input */}
        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="apTest">AP Test:</label>
            <select
              id="apTest"
              value={testName}
              onChange={handleTestNameChange}
              className={styles.input}
            >
              {apTests.map((test) => (
                <option key={test} value={test}>
                  {test}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="apScore">AP Test Score (1-5):</label>
            <input
              type="number"
              id="apScore"
              value={testScore}
              onChange={handleTestScoreChange}
              className={styles.input}
              min={1}
              max={5}
            />
          </div>
        </div>

        {/* Display the computed credit result */}
        <div className={styles.results}>
          {earnedCredit}
        </div>
      </main>
    </div>
  );
}
