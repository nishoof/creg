import { getCourseName } from "@/functions/courseNames";
import styles from "./Course.module.css";

const subjectFullNames: { [key: string]: string } = {
  "CS": "Computer Science",
  "MATH": "Mathematics",
  "RHET": "Rhetoric and Composition",
}

export function Course({ courseCode }: { courseCode: string }) {
  // Get the subject from the course code
  const subjectCode = courseCode.split(" ")[0];
  const subject = subjectFullNames[subjectCode] || subjectCode;

  // Get the course name from the course code
  const courseName = getCourseName(courseCode);

  return (
    <div className={styles.outerBox}>
      <div className={styles.highlightBox} />
      <div className={styles.innerBox}>
        <p className={styles.courseTitle}>{courseName}</p>
        <p className={styles.courseSubject}>{subject}</p>
      </div>
    </div>
  )
}
