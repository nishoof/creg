"use client";

import { authenticate, getUsername } from "@/auth";
import { getUserData, updateUserMajor } from "@/functions/db";
import { majors } from "@/functions/majors";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "../form.module.css";

export default function Account() {
  // State, holds major (input)
  const [major, setMajor] = useState<string>(majors[0]);

  // Page title and description
  const pageTitle = "Account";
  const pageDescription = "Welcome to creg! Please setup your account below";

  // Make sure user is logged in
  const { data: session } = useSession();
  const authenticatedUser = authenticate(session);
  const loggedIn = authenticatedUser !== false;

  // Get user data from database
  useEffect(() => {
    async function fetchUserData() {
      if (!authenticatedUser)
        return;

      const userdata = await getUserData(getUsername(authenticatedUser));
      const major = userdata.major;
      if (major) {
        setMajor(major);
      }
    }
    fetchUserData();
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
  function save() {
    if (!loggedIn) {    // shouldn't be possible to get here
      alert("You must be logged in to save.");
      return;
    }

    const username = getUsername(authenticatedUser);
    updateUserMajor(username, major!);
  }

  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </div>

        {/* Form section for major input */}
        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="major">Major:</label>
            <select
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className={styles.input}
            >
              {majors.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Save button */}
        <button onClick={save} className={styles.button}>
          Save
        </button>
      </main>
    </div>
  );
}
