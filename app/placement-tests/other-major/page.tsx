"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import styles from "../page.module.css";
import { getMathCourse } from "@/util/get-courses-by-placement";

export default function GenericPathway() {
  const [mathScore, setMathScore] = useState<number>(0); // Default to 0
  const [mathRecommendation, setMathRecommendation] = useState<string | null>(null);

  useEffect(() => {
    if (mathScore === null)
      setMathRecommendation(null);
    const recommendation = getMathCourse(mathScore);
    setMathRecommendation(recommendation);
  }, [mathScore]);

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

  return (
    <>
      <Header />
      <ChatBot />

      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Math Course Pathway</h1>
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
          </div>

          <div className={styles.results}>
            {mathRecommendation ? (
              <p> <strong>Math Recommendation:</strong> {mathRecommendation}  </p>
            ) : (
              <p>Please enter your score above to see your recommendation.</p>
            )}
          </div>

        </div>
      </div>
    </>
  );
}