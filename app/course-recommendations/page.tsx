"use client";

import { authenticate } from "@/auth";
import { getCourseRecommendations } from "@/functions/recommender";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Recommendations() {
  // State to hold the recommendation
  // string is for the course name, null is for no recommendations, and undefined is for loading
  const [recommendation, setRecommendation] = useState<string | null | undefined>(undefined);

  // Fetch the recommendation every time the component renders / re-renders
  useEffect(() => {
    async function fetchRecommendation() {
      const newRecommendation = await getCourseRecommendations();
      setRecommendation(newRecommendation);
    }
    fetchRecommendation();
  });

  // Make sure user is logged in
  const { data: session } = useSession();
  const authenticatedUser = authenticate(session);
  const loggedIn = authenticatedUser !== false;

  // If the user is not logged in, show a message to log in
  if (!loggedIn) {
    return (
      <div className="page">
        <main className="main">
          <div className="titleSection">
            <h1>Course Recommendations</h1>
            <p>Please log in to see your recommendations.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="main">
        <div className="titleSection">
          <h1>Course Recommendations</h1>
          <p>Find the best courses for you based on your placement tests and AP tests!</p>
        </div>

        <div>
          <h2>Welcome, {authenticatedUser.name}!</h2>
          <p>Email: {authenticatedUser.email}</p>
        </div>

        <div>
          <h2>Your Recommendations</h2>
          {recommendation ? (
            <p>We recommend you take: {recommendation}.</p>
          ) : recommendation === undefined ? (
            <p>Loading recommendations...</p>
          ) : (
            <p>No recommendations available.</p>
          )}
        </div>
      </main>
    </div>
  );
}
