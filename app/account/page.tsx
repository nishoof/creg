"use client";

import { authenticate, getUsername } from "@/auth";
import { getUserData, updateUserMajor } from "@/functions/db";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import formStyles from "../form.module.css";
import { majors } from "@/functions/majors";

export default function Account() {
  // Auth
  const { data: session } = useSession();
  const authenticatedUser = authenticate(session);
  const loggedIn = authenticatedUser !== false;

  // State, holds major (input)
  const [major, setMajor] = useState<string>("");
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultIsSuccess, setResultIsSuccess] = useState<boolean>(false);

  // Page title and description
  const pageTitle = "Account";
  const pageDescription = "Welcome to creg! Please setup your account below";

  // Update the currently selected option (in the HTML select) to the user's current major (from db)
  useEffect(() => {
    async function updateMajorSelectorDefault() {
      if (!loggedIn)
        return;

      const username = getUsername(authenticatedUser);
      const userdata = await getUserData(username);
      const major = userdata.major;

      if (major) {
        setMajor(major);
      }
    }

    updateMajorSelectorDefault();
  }, [loggedIn]);

  // If the user is not logged in, show a message to log in
  if (!loggedIn) {
    return (
      <div className="page">
        <main className="main">
          <div className="titleSection">
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>
          <p>Please log in to set up your account.</p>
        </main>
      </div>
    );
  }

  // Function for save button
  async function save() {
    if (!loggedIn) {    // shouldn't be possible to get here
      alert("You must be logged in to save.");
      return;
    }

    if (!major) {
      setResultIsSuccess(false);
      setResultMessage("No major selected");
      return;
    }

    const username = getUsername(authenticatedUser);
    await updateUserMajor(username, major!);
    setResultIsSuccess(true);
    setResultMessage("Updated account successfully!");
  }

  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </div>

        {/* Form section for major input */}
        <div className={formStyles.form}>
          <div className={formStyles.inputGroup}>
            <label htmlFor="major">Major:</label>
            <select
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className={formStyles.input}
            >
              <option value="" disabled>
                Select a major
              </option>
              {majors.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Save button */}
        <button onClick={save} className={formStyles.button}>
          Save
        </button>

        {/* Success message after adding the test to account */}
        {resultMessage &&
          (
            resultIsSuccess ?
              <div className="successMessage">
                {resultMessage}
              </div>
              :
              <div className="errorMessage">
                {resultMessage}
              </div>
          )
        }
      </main>
    </div>
  );
}
