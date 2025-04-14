"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";
import styles from "./page.module.css";
import { apTestCreditMap } from "@/util/get-courses-by-ap";

const apTests = Object.keys(apTestCreditMap);

export default function APCredit() {
  const [testName, setTestName] = useState<string>(apTests[0]);
  const [testScore, setTestScore] = useState<number>(1);
  const [earnedCredit, setEarnedCredit] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    if (!testName || testScore < 1 || testScore > 5) {
      setEarnedCredit(null);
      return;
    }

    const testCredit = apTestCreditMap[testName];
    if (!testCredit) {
      setEarnedCredit(null);
      return;
    }

    if (testScore < testCredit.score) {
      setEarnedCredit("No credit, need a score of " + testCredit.score + " or higher");
      return;
    }

    if (testCredit.credit === "General Elective") {
      setEarnedCredit("This counts as a General Elective");
      return;
    }

    if (testName === "AP Biology" && testScore == 5) {
      setEarnedCredit("This counts as " + testCredit.credit + ". You could also petition the Biology Chair to receive credit for BIOL 105-General Biology I (4 credits) and BIOL 106-General Biology II (4 credits) in place of credit for BIOL 100 and BIOL 103");
    } else {
      setEarnedCredit("This counts as " + testCredit.credit);
    }
  }, [testName, testScore]);


  const handleTestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTestName(e.target.value);
  };


  const handleAddTestToAccount = async () => {
    if (!testName || testScore < 1 || testScore > 5) {
      alert("Please select a valid test and score.");
      return;
    }

    const username = localStorage.getItem("currentUser");
    if (!username) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch("/api/ap-credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          apTestName: testName,
          apTestScore: testScore,
        }),
      });

      if (response.ok) {
        setSuccessMessage("AP Test successfully added to your account!");
        setTimeout(() => setSuccessMessage(null), 5000); // Clear message after 5 seconds
      } else {
        alert("Failed to add AP Test. Please try again.");
      }
    } catch (error) {
      console.error("Error adding AP Test:", error);
      alert("An error occurred. Please try again.");
    }
  };


  return (
    <>
      <Header />
      <ChatBot />

      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.hero}>
            <h1 className={styles.title}>AP Test Credit</h1>
            <p className={styles.subtitle}>
              Select your AP test and enter your score to see how much credit you earned.
            </p>
          </div>

          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="apTest">AP Test:</label>
              <select
                id="apTest"
                value={testName}
                onChange={handleTestChange}
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
                onChange={(e) => {
                  const numericValue = Number(e.target.value);
                  if (numericValue >= 1 && numericValue <= 5) {
                    e.target.value = numericValue.toString();
                    setTestScore(numericValue);
                  } else if (e.target.value === "") {
                    setTestScore(0); // Reset to 0 if input is cleared
                  }
                }}
                className={styles.input}
                min="1"
                max="5"
                maxLength={1}
              />
            </div>
          </div>

          <div className={styles.results}>
            {earnedCredit ?? <p>Please select a test and enter a valid score.</p>}
          </div>

          <button onClick={handleAddTestToAccount} className={styles.button}>
            Add AP Test to Account
          </button>

          {successMessage && <div style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>{successMessage}</div>}
        </div>
      </div>
    </>
  );
}