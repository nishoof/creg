"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import styles from "../page.module.css";
import Image from "next/image";
import { getComputerScienceCourse, getMathCourse } from "@/util/get-courses-by-placement";

/*
  Computer Science Placement Test
  - 75% or higher: CS 112: Intro to CS II (Java)
  - 40% to 75%: CS 111: Intro to CS I (Java)
  - Below 40%: CS 110: Intro to CS I (Python)

  Math Placement Test
  - 76-100%: MATH 109: Calculus & Analytic Geom I
  - 68-75%: MATH 108: Precalculus, but you may retake the test to try to place into MATH 109
  - 61-67%: MATH 107: Calculus for the Liberal Arts, MATH 108: Precalculus
  - 46-60%: MATH 105: Mathematics for Educators
  - 45% or below: MATH 104: Algebra for Business & Science
*/

export default function ComputerSciencePathway() {
  const [mathScore, setMathScore] = useState<number>(0); // Default to 0
  const [csScore, setCsScore] = useState<number>(0); // Default to 0
  const [mathRecommendation, setMathRecommendation] = useState<string | null>(null);
  const [csRecommendation, setCsRecommendation] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (mathScore === null) {
      setMathRecommendation(null);
      return;
    }
    const recommendation = getMathCourse(mathScore);
    setMathRecommendation(recommendation);
  }, [mathScore]);

  useEffect(() => {
    if (csScore === null) {
      setCsRecommendation(null);
      return;
    }
    const recommendation = getComputerScienceCourse(csScore);
    setCsRecommendation(recommendation);
  }, [csScore]);

  const handleMathScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Remove leading zeros
    if (value.startsWith("0") && value.length > 1) {
      e.target.value = value.slice(1);
    }

    const numericValue = Number(value);
    if (numericValue >= 0 && numericValue <= 100) {
      setMathScore(numericValue);
    }
  };

  const handleCsScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Remove leading zeros
    if (value.startsWith("0") && value.length > 1) {
      e.target.value = value.slice(1);
    }

    const numericValue = Number(value);
    if (numericValue >= 0 && numericValue <= 100) {
      setCsScore(numericValue);
    }
  };

  const handleAddTestsToAccount = async () => {
    console.log(mathScore, csScore);

    if (mathScore < 0 || mathScore > 100 || csScore < 0 || csScore > 100) {
      alert("Please enter valid scores.");
      return;
    }

    const username = localStorage.getItem("currentUser");
    if (!username) {
      alert("Please log in first.");
      return;
    }

    // Add scores
    try {
      // Add CS Placement Test score
      const csResponse = await fetch("/api/placement-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          placementTestName: "CS Placement Test",
          placementTestScore: csScore,
        }),
      });

      if (!csResponse.ok) {
        throw new Error("Failed to add CS placement test score.");
      }

      // Add Math Placement Test score
      const mathResponse = await fetch("/api/placement-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          placementTestName: "Math Placement Test",
          placementTestScore: mathScore,
        }),
      });

      if (!mathResponse.ok) {
        throw new Error("Failed to add Math placement test score.");
      }

      // Success
      setSuccessMessage("Placement Tests successfully added to your account!");
      setTimeout(() => setSuccessMessage(null), 5000); // Clear message after 5 seconds
    } catch (error) {
      console.error("Error adding a test:", error);
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
            <h1 className={styles.title}>Computer Science Pathway</h1>
            <p className={styles.subtitle}>
              Enter your placement test results to see your recommended pathways.
            </p>
          </div>

          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="mathScore">Math Placement Test Score:</label>
              <input
                type="number"
                id="mathScore"
                value={mathScore}
                onChange={handleMathScoreChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="csScore">Computer Science Placement Test Score:</label>
              <input
                type="number"
                id="csScore"
                value={csScore}
                onChange={handleCsScoreChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.results}>
            {mathRecommendation || csRecommendation ? (
              <>
                {mathRecommendation && (
                  <p>
                    <strong>Math Recommendation:</strong> {mathRecommendation}
                  </p>
                )}
                {csRecommendation && (
                  <p>
                    <strong>CS Recommendation:</strong> {csRecommendation}
                  </p>
                )}
              </>
            ) : (
              <p>Please enter your scores above to see your recommendations.</p>
            )}
          </div>

          <button onClick={handleAddTestsToAccount} className={styles.button}>
            Add Placement Tests to Account
          </button>

          {successMessage && <div style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>{successMessage}</div>}

          <div className={styles.flowchart}>
            <Image
              src="/CSPathwayFlowchart.png"
              alt="CS Pathway Flowchart"
              width={800}
              height={600}
              className={styles.flowchartImage}
            />
          </div>
        </div>
      </div>
    </>
  );
}