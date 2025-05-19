export default function GettingStarted() {
  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>Getting Started</h1>
          <p>Welcome to creg! Follow the steps to get started.</p>
        </div>

        <h2>Step 1: Create an Account</h2>
        <p className="marginedParagraph">To get started, click the sign in button at the top right and sign in using Google.</p>
        <p className="marginedParagraph">Use your @dons.usfca.edu account!</p>

        <h2>Step 2: Select Your Major</h2>
        <p className="marginedParagraph">Select your major below to help us recommend the right content for you!</p>
        <div className="majorSelect">
          <select>
            <option value="Computer Science">Computer Science</option>
            <option value="Data Science">Data Science</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Information Systems">Information Systems</option>
          </select>
          <button className="selectButton">Select</button>
        </div>
        {/* TODO: if they need to change it later? */}

        <h2>Step 3: Watch Universtiy Graduation Requirements Videos</h2>
        <p className="marginedParagraph">Watch two short videos on the graduation requirements and core curriculum.</p>

        <h2>Step 4: Watch Major-Specific Graduation Requirements Videos</h2>
        <p className="marginedParagraph">Learn about the specific requirements and recommendations for your chosen major and see example schedules.</p>

        <h2>Step 5: Placement Tests</h2>
        <p className="marginedParagraph">Complete your placement tests and add scores to your creg account.</p>

        <h2>Step 6: AP Tests</h2>
        <p className="marginedParagraph">Add your AP Test scores to your creg account and see what credit you can get at USF.</p>

        <h2>Step 7: Course Recommendations</h2>
        <p className="marginedParagraph">Finally, see what classes you should take based on your placement test results and the AP tests you have taken!</p>

      </main>
    </div>
  );
}