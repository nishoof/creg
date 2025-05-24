"use client";

import Link from 'next/link';
import { useState } from 'react';
import formStyles from '../form.module.css';

export default function PlacementTests() {
  const [csPlacementTestScore, setCsPlacementTestScore] = useState<number | null>(null);
  const [mathPlacementTestScore, setMathPlacementTestScore] = useState<number | null>(null);
  const [languagePlacementTestName, setLanguagePlacementTestName] = useState<string | null>(null);
  const [languagePlacementTestScore, setLanguagePlacementTestScore] = useState<number | null>(null);

  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>Placement Tests</h1>
          <p>Take your placement tests then enter your test results to see your recommended pathways</p>
        </div>

        <h2>Take Your Placement Tests</h2>
        <p>To take your placement tests, visit the USF website: <Link href="https://myusf.usfca.edu/newstudentregistration/placement-tests" className="link" target="_blank" rel="noopener noreferrer">Placement Tests at USF</Link></p>

        <h2>Enter Your Placement Test Scores</h2>
        <div className={formStyles.form}>
          <div className={formStyles.inputGroup}>
            <label htmlFor="csPlacement">CS Placement Test Score:</label>
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
