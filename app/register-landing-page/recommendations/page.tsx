"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation" // For navigation
import { getUserCredit, type UserCredit, type Test } from "@/util/get-user-credit"
import { getComputerScienceCourse, getMathCourse } from "@/util/get-courses-by-placement"
import { getCsMajorCourses, getUSFCourseEquivalentsFromAP } from "@/util/get-courses-by-ap"
import Header from "@/components/Header"
import ChatBot from "@/components/ChatBot"
import styles from "./page.module.css"

export default function Recommendations() {
  const [userCredit, setUserCredit] = useState<UserCredit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [csMajorRecommendations, setCsMajorRecommendations] = useState<string[]>([])
  const [mathRecommendation, setMathRecommendation] = useState<string | null>(null)
  const [apEquivalents, setApEquivalents] = useState<string[]>([])
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const router = useRouter() // For programmatic navigation

  // Redirect to login if no user is logged in
  useEffect(() => {
    console.log("Checking for logged-in user...");

    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login") // Redirect to the login page
    }
  }, [router])

  // Core curriculum data
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const data = await getUserCredit()
        setUserCredit(data)

        // Process AP credits
        const equivalents = getUSFCourseEquivalentsFromAP(data.apCredit)
        setApEquivalents(equivalents)

        // Get CS placement test score
        const csPlacementTest = data.placementTests.find((test) => test.testName === "CS Placement Test")
        const csScore = csPlacementTest ? csPlacementTest.testScore : 0

        // Get Math placement test score
        const mathPlacementTest = data.placementTests.find((test) => test.testName === "Math Placement Test")
        const mathScore = mathPlacementTest ? mathPlacementTest.testScore : 0

        // Get recommendations
        const csMajorCourseRecommendationByPlacement = getComputerScienceCourse(csScore)
        const csMathCourseRecommendationByPlacement = getMathCourse(mathScore)

        // Get recommendations based on AP
        const { csMajorCourseRecommendation, csMathCourseRecommendation } = getCsMajorCourses(equivalents)

        // Choose the higher recommendation
        const finalCsRecommendation =
          csMajorCourseRecommendationByPlacement > csMajorCourseRecommendation
            ? csMajorCourseRecommendationByPlacement
            : csMajorCourseRecommendation

        const finalMathRecommendation =
          csMathCourseRecommendationByPlacement > csMathCourseRecommendation
            ? csMathCourseRecommendationByPlacement
            : csMathCourseRecommendation

        // Set recommendations
        setCsMajorRecommendations([finalCsRecommendation])
        setMathRecommendation(finalMathRecommendation)
      } catch (err) {
        console.log("Error fetching data:", err)
        setError("Failed to load your course data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Toggle accordion
  const toggleAccordion = (id: string) => {
    if (openAccordion === id) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(id)
    }
  }

  // Helper function to render test scores
  const renderTestScores = (tests: Test[], title: string) => {
    if (!tests || tests.length === 0) return <p>No {title} on record</p>

    return (
      <div>
        {tests.map((test, index) => (
          <div key={index} className={styles.testItem}>
            <span className={styles.testName}>{test.testName}</span>
            <span className={styles.scoreBadge}>{test.testScore}</span>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.container} style={{ marginTop: "6rem" }}>
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
            <span>Loading your course recommendations...</span>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.container} style={{ marginTop: "6rem" }}>
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <ChatBot />

      <main className={`${styles.container} ${styles.fadeIn}`} style={{ marginTop: "6rem" }}>
        <h1 className={styles.pageTitle}>Your Course Recommendations</h1>
        <p className={styles.pageDescription}>
          Based on your academic history, here are the courses we recommend for your first semester.
        </p>

        <div className={styles.grid}>
          {/* Box 1: AP & Placement Tests */}
          <div className={styles.card}>
            <div className={`${styles.cardHeader} ${styles.cardHeaderTests}`}>
              <h2 className={styles.cardTitle}>
                Tests on Record
              </h2>
              <div className={styles.cardDescription}>Your AP & Placement Test scores</div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>AP Tests</h3>
                {renderTestScores(userCredit?.apCredit || [], "AP Tests")}
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Placement Tests</h3>
                {renderTestScores(userCredit?.placementTests || [], "Placement Tests")}
              </div>

              {apEquivalents.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Course Equivalents</h3>
                  <ul className={styles.bulletList}>
                    {apEquivalents.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.cardFooter}>
              <a href="/ap-credit" className={styles.link}>
                AP Tests
                <span className={styles.iconSmall}>→</span>
              </a>
              <a href="/placement-tests" className={styles.link}>
                Placement Tests
                <span className={styles.iconSmall}>→</span>
              </a>
            </div>
          </div>

          {/* Box 2: Core Requirements */}
          <div className={styles.card}>
            <div className={`${styles.cardHeader} ${styles.cardHeaderCore}`}>
              <h2 className={styles.cardTitle}>
                Core Curriculum
              </h2>
              <div className={styles.cardDescription}>USF Core requirements (44 units total)</div>
            </div>
            <div
              className={`${styles.cardContent} ${styles.scrollArea}`}
              style={{ paddingTop: "1.5rem", paddingBottom: "0.5rem" }}
            >
              <div className={styles.accordionContainer}>
                {coreRequirements.map((area) => (
                  <div
                    key={area.id}
                    className={`${styles.accordionItem} ${openAccordion === area.id ? styles.accordionOpen : ""}`}
                  >
                    <div className={styles.accordionHeader} onClick={() => toggleAccordion(area.id)}>
                      {area.area}
                      <span className={styles.accordionIcon}>▼</span>
                    </div>
                    <div className={styles.accordionContent}>
                      {area.requirements.map((req, reqIndex) => (
                        <div key={reqIndex} style={{ marginBottom: "1rem", paddingTop: "0.5rem" }}>
                          <h4 className={styles.requirementTitle}>{req.name}</h4>
                          <div className={styles.courseListInAccordion}>
                            {req.courses.map((course, courseIndex) => (
                              <div key={courseIndex} className={styles.courseListItem}>
                                <a href={`/catalog/${course.replace(" ", "-").toLowerCase()}`} className={styles.link}>
                                  {course}
                                  <span className={styles.iconSmall}>↗</span>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Box 3: Major-specific Recommendations */}
          <div className={styles.card}>
            <div className={`${styles.cardHeader} ${styles.cardHeaderRecommended}`}>
              <h2 className={styles.cardTitle}>
                Recommended Courses
              </h2>
              <div className={styles.cardDescription}>Your personalized course plan</div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Major Courses</h3>
                {csMajorRecommendations.length > 0 ? (
                  <ul className={styles.courseList}>
                    {csMajorRecommendations.map((course, index) => (
                      <li
                        key={index}
                        className={`${styles.courseItem} ${styles.recommendedCourse}`}
                      >
                        <div className={styles.courseTitle}>{course}</div>
                        <div className={styles.courseSubtitle}>Computer Science</div>
                        <a
                          href={`/catalog/${course.split(":")[0].trim().toLowerCase().replace(" ", "-")}`}
                          className={styles.link}
                        >
                          View in catalog
                          <span className={styles.iconSmall}>↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#6b7280" }}>No major courses recommended</p>
                )}
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Math Requirement</h3>
                {mathRecommendation ? (
                  <div className={`${styles.courseItem} ${styles.recommendedCourse}`}>
                    <div className={styles.courseTitle}>{mathRecommendation}</div>
                    <div className={styles.courseSubtitle}>Mathematics</div>
                    <a
                      href={`/catalog/${mathRecommendation.split(":")[0].trim().toLowerCase().replace(" ", "-")}`}
                      className={styles.link}
                    >
                      View in catalog
                      <span className={styles.iconSmall}>↗</span>
                    </a>
                  </div>
                ) : (
                  <p style={{ color: "#6b7280" }}>No math course recommended</p>
                )}
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Core Recommendations</h3>
                <div className={`${styles.courseItem} ${styles.recommendedCourse}`}>
                  <div className={styles.courseTitle}>RHET 110</div>
                  <div className={styles.courseSubtitle}>Written Communication I</div>
                  <a href="/catalog/rhet-110" className={styles.link}>
                    View in catalog
                    <span className={styles.iconSmall}>↗</span>
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <a href="/degree-evaluation" className={styles.link}>
                View full degree evaluation
                <span className={styles.iconSmall}>→</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

