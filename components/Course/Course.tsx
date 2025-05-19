import styles from "./Course.module.css";

const subjectFullNames: { [key: string]: string } = {
  "CS": "Computer Science",
  "MATH": "Mathematics",
  "RHET": "Rhetoric and Composition",
}

export function Course({ courseTitle }: { courseTitle: string }) {
  // Get the subject from the course title
  const subjectCode = courseTitle.split(" ")[0];
  const subject = subjectFullNames[subjectCode] || subjectCode;

  return (
    <div className={styles.outerBox}>
      <div className={styles.highlightBox} />
      <div className={styles.innerBox}>
        <p className={styles.courseTitle}>{courseTitle}</p>
        <p className={styles.courseSubject}>{subject}</p>
      </div>
    </div>
  )
}
