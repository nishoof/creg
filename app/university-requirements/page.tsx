import styles from './page.module.css';

export default function UniversityRequirements() {
  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>University Graduation Requirements</h1>
          <p>Watch two short videos on the graduation requirements and core curriculum</p>
        </div>

        <div className={styles.infoGrid}>
          <div className="infoCard">
            <h2>University Graduation Requirements</h2>
            <p>This video explains the university&apos;s graduation requirements that all students must complete to earn their degree.</p>
            <div className="videoWrapper">
              <iframe
                className="video"
                src="https://www.youtube.com/embed/pU5SzMZaq64"
                title="CAS Graduation Requirements"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className="infoCard">
            <h2>The Core Curriculum</h2>
            <p>Discover the foundational courses that make up the university&apos;s core curriculum and how they contribute to your education.</p>
            <div className="videoWrapper">
              <iframe
                className="video"
                src="https://www.youtube.com/embed/aNisgRLwo0M"
                title="The Core Curriculum"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </main >
    </div >
  );
}
