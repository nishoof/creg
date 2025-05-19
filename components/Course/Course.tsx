import { getCourseName, getSubjectName } from "@/functions/courses";
import styles from "./Course.module.css";

export function Course({ courseCode }: { courseCode: string }) {
  // Get the subject from the course code
  const subjectCode = courseCode.split(" ")[0];
  const subject = getSubjectName(subjectCode);

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
