import { createUser, getUserData } from "./db";

const csPathway = ["CS 110", "CS 111", "CS 112", "CS 221", "CS 245"];

export async function getUserDataOrMakeUser(username: string) {
    let user = await getUserData(username);
    if (user)
        return user;

    await createUser(username);
    return getUserData(username);
}

export async function getCourseRecommendations(email: string) {
    const username = email.split("@")[0];
    const userdata = await getUserDataOrMakeUser(username);
    if (!userdata) {
        throw new Error("User not found and could not be created.");
    }
    const credits = userdata.credits;

    console.log(`User ${username} has the following credits: ${credits}`);

    // If the user doesn't have any credits, recommend the first course in the pathway
    if (credits.length === 0) {
        return csPathway[0];
    }

    // Convert credits to a set of just the course names
    const creditSet = new Set(credits.map((credit) => credit.course));

    // Find the first course in the pathway that the user does not have credit for, then return it
    for (const course of csPathway) {
        if (!creditSet.has(course)) {
            return course;
        }
    }

    // If the user has credit for all courses in the pathway, return null
    return null;
}
