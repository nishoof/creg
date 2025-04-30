import { getUserData } from "./db";

const csPathway = ["CS110", "CS111", "CS112", "CS221", "CS245"];

export async function getCourseRecommendations(email: string) {
    const username = email.split("@")[0];
    const userdata = await getUserData(username);
    const credits = userdata.credits;

    if (!credits) {
        return csPathway[0];
    }

    // Go through the courses in order
    for (const course of csPathway) {
        // Check if the user has credit for this course already
        if (credits.some((credit) => {
            return credit.course === course;
        })) continue;

        // If not, then they should do this course
        return course;
    }

    return null;
}
