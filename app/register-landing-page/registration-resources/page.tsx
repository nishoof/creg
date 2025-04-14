"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Header from "@/components/Header";

interface Course {
  _id: string;
  subject: string;
  number: string;
  course_title: string;
  units: string;
  description: string;
  prerequisites: string;
  restrictions: string;
  college: string;
}

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [colleges, setColleges] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [prerequisitesFilter, setPrerequisitesFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of courses per page
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login");
      return;
    }

    // Initial fetch with default parameters
    fetchCourses();
  }, [router]);

  const fetchCourses = async (page = 1) => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCollege) params.append("college", selectedCollege);
      if (selectedSubject) params.append("subject", selectedSubject);
      if (prerequisitesFilter)
        params.append("hasPrerequisites", prerequisitesFilter);
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      const response = await fetch(`/api/courses?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();

      // Check if we have courses data
      if (!data.courses || !Array.isArray(data.courses)) {
        throw new Error("Invalid course data received");
      }

      setCourses(data.courses);

      // Set colleges for dropdown if available
      if (data.colleges && Array.isArray(data.colleges)) {
        setColleges(data.colleges);
      }

      // Set subjects for dropdown if available
      if (data.subjects && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
      }

      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Error loading courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCourses(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCollege("");
    setSelectedSubject("");
    setPrerequisitesFilter("");
    setCurrentPage(1);
    fetchCourses(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchCourses(newPage);
  };

  return (
    <>
      <Header />

      <div className={styles.container}>
        {error && (
          <div className={styles["error-alert"]}>
            <p>{error}</p>
          </div>
        )}
        <div className={styles["filter-container"]}>
          <div className={styles.card}>
            <div className={styles["card-header"]}>
              <h2 className={styles["card-title"]}>Search & Filters</h2>
            </div>
            <div className={styles["card-content"]}>
              <div className={styles["filter-group"]}>
                <label className={styles["filter-label"]} htmlFor="search">
                  Search
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by course code, title, or description"
                  className={styles["filter-input"]}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className={styles["filter-group"]}>
                <label className={styles["filter-label"]} htmlFor="college">
                  College
                </label>
                <select
                  id="college"
                  className={styles["filter-select"]}
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                >
                  <option value="">All Colleges</option>
                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject dropdown replaces Restrictions filter */}
              <div className={styles["filter-group"]}>
                <label className={styles["filter-label"]} htmlFor="subject">
                  Subject
                </label>
                <select
                  id="subject"
                  className={styles["filter-select"]}
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles["filter-group"]}>
                <label
                  className={styles["filter-label"]}
                  htmlFor="prerequisites"
                >
                  Prerequisites
                </label>
                <select
                  id="prerequisites"
                  className={styles["filter-select"]}
                  value={prerequisitesFilter}
                  onChange={(e) => setPrerequisitesFilter(e.target.value)}
                >
                  <option value="">All Courses</option>
                  <option value="yes">Has Prerequisites</option>
                  <option value="no">No Prerequisites</option>
                </select>
              </div>

              <button
                className={styles["filter-button"]}
                onClick={handleSearch}
              >
                Apply Filters
              </button>

              <button
                className={`${styles["filter-button"]} ${styles.secondary}`}
                onClick={handleReset}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        <div className={styles["catalog-layout"]}>
          <div className={styles["card-content"]}>
            {loading ? (
              <div className={styles["loading-message"]}>
                Loading courses...
              </div>
            ) : courses.length === 0 ? (
              <div className={styles["empty-message"]}>
                No courses found matching your criteria.
              </div>
            ) : (
              <div className={styles["courses-list"]}>
                {courses.map((course) => (
                  <div key={course._id} className={styles["course-card"]}>
                    <div className={styles["course-header"]}>
                      <h3 className={styles["course-title"]}>
                        {course.course_title} - {course.subject}: {course.number}
                        <span className={styles["units-badge"]}>
                          {course.units}{" "}
                          {Number.parseInt(course.units) === 1
                            ? "Unit"
                            : "Units"}
                        </span>
                      </h3>
                      <p className={styles["course-code"]}>
                        {course.number}
                      </p>
                      <p className={styles["course-college"]}>
                        {course.college}
                      </p>
                    </div>
                    <div className={styles["course-details"]}>
                      <div className={styles["course-section"]}>
                        <h4 className={styles["section-title"]}>
                          Description
                        </h4>
                        <p className={styles["section-content"]}>
                          {course.description || (
                            <span className={styles["empty-value"]}>
                              No description available
                            </span>
                          )}
                        </p>
                      </div>

                      {course.prerequisites && (
                        <div className={styles["course-section"]}>
                          <h4 className={styles["section-title"]}>
                            Prerequisites
                          </h4>
                          <p className={styles["section-content"]}>
                            {course.prerequisites}
                          </p>
                        </div>
                      )}

                      {course.restrictions && (
                        <div className={styles["course-section"]}>
                          <h4 className={styles["section-title"]}>
                            Restrictions
                          </h4>
                          <p className={styles["section-content"]}>
                            {course.restrictions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles["pagination-button"]}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className={styles["page-info"]}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className={styles["pagination-button"]}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
