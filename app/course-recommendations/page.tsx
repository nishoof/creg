"use client";

import { authenticate } from "@/auth";
import { getCourseRecommendations } from "@/functions/recommender";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Recommendations() {
  // State to hold the recommendation
  // string is for the course name, null is for no recommendations, and undefined is for loading
  const [recommendation, setRecommendation] = useState<string | null | undefined>(undefined);

  // State to hold which accordion is open for the cores
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Function to handle accordion click
  const toggleAccordion = (accordion: string) => {
    if (openAccordion === accordion) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(accordion);
    }
  }

  // Core curriculum requirements
  const coreRequirements = [
    {
      id: "area-a",
      area: "Area A – Foundations of Communication (8 units)",
      requirements: [
        { name: "Public Speaking (4 units)", courses: ["RHET 103", "RHET 195"] },
        { name: "Rhetoric and Composition (4 units)", courses: ["RHET 110", "RHET 120", "RHET 130", "RHET 131"] },
      ],
    },
    {
      id: "area-b",
      area: "Area B – Mathematics and the Sciences (8 units)",
      requirements: [
        {
          name: "Math or Quantitative Science (4 units)",
          courses: ["MATH 104", "MATH 105", "MATH 106", "MATH 107", "MATH 108", "MATH 109"],
        },
        { name: "Applied or Laboratory Science (4 units)", courses: ["BIOL 100", "CHEM 111", "PHYS 100", "ENVS 110"] },
      ],
    },
    {
      id: "area-c",
      area: "Area C – Humanities (8 units)",
      requirements: [
        { name: "Literature (4 units)", courses: ["ENGL 192", "ENGL 195", "ENGL 198"] },
        { name: "History (4 units)", courses: ["HIST 110", "HIST 120", "HIST 130"] },
      ],
    },
    {
      id: "area-d",
      area: "Area D – Philosophy, Theology, and Ethics (12 units)",
      requirements: [
        { name: "Philosophy (4 units)", courses: ["PHIL 110", "PHIL 195"] },
        { name: "Theology and Religious Studies (4 units)", courses: ["THRS 100", "THRS 104", "THRS 106"] },
        { name: "Ethics (4 units)", courses: ["PHIL 240", "THRS 220", "CS 195"] },
      ],
    },
    {
      id: "area-e",
      area: "Area E – Social Sciences (4 units)",
      requirements: [{ name: "Social Sciences", courses: ["PSYC 101", "SOC 150", "POLS 101", "ECON 111", "ECON 112"] }],
    },
    {
      id: "area-f",
      area: "Area F – Visual and Performing Arts (4 units)",
      requirements: [{ name: "Visual and Performing Arts", courses: ["ART 101", "MUS 120", "THTR 105", "DANC 140"] }],
    },
  ]

  // Fetch the recommendation every time the component renders / re-renders
  useEffect(() => {
    async function fetchRecommendation() {
      const newRecommendation = await getCourseRecommendations();
      setRecommendation(newRecommendation);
    }
    fetchRecommendation();
  });

  // Make sure user is logged in
  const { data: session } = useSession();
  const authenticatedUser = authenticate(session);
  const loggedIn = authenticatedUser !== false;

  // If the user is not logged in, show a message to log in
  if (!loggedIn) {
    return (
      <div className="page">
        <main className="main">
          <div className="titleSection">
            <h1>Course Recommendations</h1>
            <p>Please log in to see your recommendations.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>Course Recommendations</h1>
          <p>Find the best courses for you based on your placement tests and AP tests!</p>
        </div>

        <div>
          <h2>Welcome, {authenticatedUser.name}!</h2>
          <p>Email: {authenticatedUser.email}</p>
          <p>Major: Computer Science</p>
        </div>

        <div>
          <h2>Your Recommendations</h2>

          {/* Previous code, gets the personalized recommendation */}

          {/* {recommendation ? (
            <p>We recommend you take: {recommendation}.</p>
          ) : recommendation === undefined ? (
            <p>Loading recommendations...</p>
          ) : (
            <p>No recommendations available.</p>
          )} */}

          <div className={styles.grid}>

            {/* AP & Placement Test Scores */}
            <div className={styles.card}>
              <div className={`${styles.cardSection} ${styles.cardHeaderGreen}`}>
                <h3>Tests on Record</h3>
                <p>AP & Placement Test scores</p>
              </div>
              <div className={styles.cardSection}>
                <h4>AP Tests</h4>
                <ul className={styles.unstyledList}>
                  {/* PLACEHOLDER */}
                  {/* TODO: Get tests from db */}
                  {/* TODO: Placement tests in different list */}
                  <li>AP Calculus AB: 5</li>
                  <li>AP Calculus BC: 4</li>
                  <li>AP Chemistry: 3</li>
                </ul>
              </div>
            </div>

            {/* Core Curriculum */}
            <div className={styles.card}>
              <div className={`${styles.cardSection} ${styles.cardHeaderBlue}`}>
                <h3>Core Curriculum</h3>
                <p>USF Core requirements (44 units total)</p>
              </div>
              <div className={styles.cardSection}>
                <ul className={styles.unstyledList}>
                  <li>Area A - Foundations of Communication (8 units)</li>
                  <li>Area B - Mathematics and the Sciences (8 units)</li>
                  <li>Area C - Humanities (8 units)</li>
                  <li>Area D - Philosophy, Theology, and Ethics (12 units)</li>
                  <li>Area E - Social Sciences (4 units)</li>
                  <li>Area F - Visual and Performing Arts (4 units)</li>
                </ul>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className={styles.card}>
              <div className={`${styles.cardSection} ${styles.cardHeaderYellow}`}>
                <h3>Recommended Courses</h3>
                <p>Your personalized course plan</p>
              </div>
              <div className={styles.cardSection}>
                <h4>Major Courses</h4>
                <ul className={styles.unstyledList}>
                  <li>CS 112: Intro to CS II (Java)</li>
                  <li>MATH 201: Discrete Mathematics</li>
                </ul>

                <h4>Core Courses</h4>
                <ul className={styles.unstyledList}>
                  <li>RHET 103: Public Speaking</li>
                  <li>RHET 120: Written Communication II</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
