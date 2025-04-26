import Link from 'next/link';
import styles from './page.module.css';

export default function MajorRequirements() {
  const majorVideos = [
    { name: "Accounting", url: "https://youtu.be/Yrbj5ilS9ro" },
    { name: "Advertising", url: "https://www.youtube.com/watch?v=-xu4FN1csPw" },
    { name: "Asian Studies", url: "https://youtu.be/CxeQB-MyO8Y" },
    { name: "Architecture", url: "https://youtu.be/m075Kctv9Gg" },
    { name: "Biology", url: "https://youtu.be/FK5CjHk0Tbo" },
    { name: "Chemistry", url: "https://www.youtube.com/watch?v=3sUDzwGaPrY" },
    { name: "Computer Science", url: "https://www.youtube.com/watch?v=Nrrz92sU314" },
    { name: "Data Science", url: "https://youtu.be/mrinjBbrSNU" },
    { name: "Design", url: "https://youtu.be/qAm2T9_WDdY" },
    { name: "Engineering", url: "https://youtu.be/gKvRX_cghU8" },
    { name: "Mathematics", url: "https://youtu.be/-TRooFEBiNc" },
    { name: "Physics", url: "https://youtu.be/otsFJBp1yVM" },
    { name: "Psychology", url: "https://youtu.be/un0ua791UGs" },
    { name: "Undeclared Business", url: "https://youtu.be/RdohQKNGIPo" },
    { name: "Undeclared Arts", url: "https://youtu.be/Ybo3qd0pijI" },
    { name: "Undeclared Science", url: "https://youtu.be/E-nxzZ8IzfI" }
  ];

  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>Major-Specific Graduation Requirements</h1>
          <p>Learn about the specific requirements and recommendations for your chosen major and see example schedules</p>
        </div>

        <h2>Select your major to watch your major-specific video:</h2>

        <ul className={styles.majorList}>
          {majorVideos.map(major => (
            <li key={major.name} className={styles.majorItem}>
              <Link href={major.url} target="_blank" rel="noopener noreferrer" className={styles.majorLink}>
                <span className={styles.majorName}>{major.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
