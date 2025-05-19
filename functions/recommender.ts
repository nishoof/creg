"use server";

import { auth, authenticate, getUsername } from "@/auth";
import { getCredit } from "./credit";
import { getUserData } from "./db";

const csPathway = ["CS 110", "CS 111", "CS 112", "CS 221", "CS 245"];

export async function getCourseRecommendations() {
    const session = await auth();
    const authenticatedUser = authenticate(session);
    if (!authenticatedUser)
        throw new Error("User is not logged in");

    const username = getUsername(authenticatedUser);
    const userdata = await getUserData(username);
    if (!userdata) {
        throw new Error("User not found and could not be created.");
    }
    const credits = getCredit(userdata.apTests, userdata.placementTests);

    console.log(`User ${username} has the following credits: ${credits}`);

    // If the user doesn't have any credits, recommend the first course in the pathway
    if (credits.size === 0) {
        return csPathway[0];
    }

    // Find the first course in the pathway that the user does not have credit for, then return it
    for (const course of csPathway) {
        if (!credits.has(course)) {
            return course;
        }
    }

    // If the user has credit for all courses in the pathway, return null
    return null;
}
