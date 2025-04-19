"use client";

import { useState, useEffect, JSX } from "react";
import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import styles from "../page.module.css";
import { getMathCourse } from "@/util/get-courses-by-placement";

/*
  Chemistry Placement Test
  - 38-100% on first or second attempt: You may register for CHEM 111: General Chemistry I (3 unit) & CHEM 112: Laboratory (1 unit). Complete this form to be able to register for CHEM 111/112: https://forms.gle/G16sXeXYcSjgufgJA
  - 0-37% on first attempt: You cannot yet register for CHEM 111/112. First, you must complete the free asynchronous online course ([signup link](https://forms.gle/SWqbQJRdQfoiFQNf6)) and re-take the placement test.
  - 0-37% on second attempt: You may register for CHEM 111 and CHEM 112 but should also concurrently register for CHEM 191: Peer-Led Team Learning (1 unit) to help you succeed in the course. Complete this form to be able to register for CHEM 111/112: https://forms.gle/G16sXeXYcSjgufgJA

  Math Placement Test
  - 76-100%: MATH 109: Calculus & Analytic Geom I
  - 68-75%: MATH 108: Precalculus, but you may retake the test to try to place into MATH 109
  - 61-67%: MATH 107: Calculus for the Liberal Arts, MATH 108: Precalculus
  - 46-60%: MATH 105: Mathematics for Educators
  - 45% or below: MATH 104: Algebra for Business & Science
*/

export default function ChemistryPathway() {
  const [mathScore, setMathScore] = useState<number>(0); // Default to 0
  const [chemScore, setChemScore] = useState<number>(0); // Default to 0
  const [chemAttempt, setChemAttempt] = useState<"first" | "second">("first"); // Default to "first"
  const [mathRecommendation, setMathRecommendation] = useState<string | null>(null);
  const [chemRecommendation, setChemRecommendation] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (mathScore === null)
      setMathRecommendation(null);
    const recommendation = getMathCourse(mathScore);
    setMathRecommendation(recommendation);
  }, [mathScore]);

  useEffect(() => {
    if (chemScore !== null) {
      if (chemScore >= 38) {
        setChemRecommendation(
          <>
            You may register for CHEM 111: General Chemistry I (3 unit) & CHEM 112: Laboratory (1 unit). Complete this form to be able to register:{" "}
            <a href="https://forms.gle/G16sXeXYcSjgufgJA" target="_blank" rel="noopener noreferrer">
              https://forms.gle/G16sXeXYcSjgufgJA
            </a>
          </>
        );
      } else if (chemAttempt === "first") {
        setChemRecommendation(
          <>
            Complete the free asynchronous online course
            (signup link:{" "}
            <a href="https://forms.gle/SWqbQJRdQfoiFQNf6" target="_blank" rel="noopener noreferrer">
              https://forms.gle/SWqbQJRdQfoiFQNf6
            </a>) then retake the placement test.
          </>
        );
      } else if (chemAttempt === "second") {
        setChemRecommendation(
          <>
            You may register for CHEM 111: General Chemistry I (3 unit) & CHEM 112: Laboratory (1 unit). But you should also concurrently register for CHEM 191: Peer-Led Team Learning (1 unit) to help you succeed in the course. Complete this form to register for CHEM 111/112:{" "}
            <a href="https://forms.gle/G16sXeXYcSjgufgJA" target="_blank" rel="noopener noreferrer">
              https://forms.gle/G16sXeXYcSjgufgJA
            </a>
          </>
        );
      }
    } else {
      setChemRecommendation(null);
    }
  }, [chemScore, chemAttempt]);

  const handleMathScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove leading zeros
    if (value.startsWith("0") && value.length > 1) {
      value = value.slice(1);
    }

    const numericValue = Number(value);
    if (numericValue >= 0 && numericValue <= 100) {
      setMathScore(numericValue);
    }
  };

  const handleChemScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove leading zeros
    if (value.startsWith("0") && value.length > 1) {
      value = value.slice(1);
    }

    const numericValue = Number(value);
    if (numericValue >= 0 && numericValue <= 100) {
      setChemScore(numericValue);
    }
  };

  const handleChemAttemptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChemAttempt(e.target.value as "first" | "second");
  };

  return (
    <>
      <Header />
      <ChatBot />

      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Chemistry Pathway</h1>
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
              <label htmlFor="chemScore">Chemistry Placement Test Score:</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="number"
                  id="chemScore"
                  value={chemScore}
                  onChange={handleChemScoreChange}
                  className={styles.input}
                  style={{ flex: 1 }}
                />
                <select
                  id="chemAttempt"
                  value={chemAttempt}
                  onChange={handleChemAttemptChange}
                  className={styles.select}
                  style={{ flex: 1 }}
                >
                  <option value="first">First Attempt</option>
                  <option value="second">Second Attempt</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            {mathRecommendation || chemRecommendation ? (
              <>
                {mathRecommendation && (
                  <p>
                    <strong>Math Recommendation:</strong> {mathRecommendation}
                  </p>
                )}
                {chemRecommendation && (
                  <p>
                    <strong>Chemistry Recommendation:</strong> {chemRecommendation}
                  </p>
                )}
              </>
            ) : (
              <p>Please enter your scores above to see your recommendations.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}