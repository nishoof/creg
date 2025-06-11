/** Recommends the next course in a pathway based on the user's current credits */
function getRecFromPathway(credits: Set<string>, pathway: string[]) {
    // If the user doesn't have any credits, recommend the first course in the pathway
    if (credits.size === 0) {
        return pathway[0];
    }

    // Find the first course in the pathway that the user does not have credit for, then return it
    for (const course of pathway) {
        if (!credits.has(course)) {
            return course;
        }
    }

    // If the user has credit for all courses in the pathway, return null
    return null;
}

export function getCSRec(credits: Set<string>) {
    const csPathway = ["CS 110", "CS 111", "CS 112", "CS 221"];
    return getRecFromPathway(credits, csPathway);
}

export function getCSMathRec(placementTestScore: number) {
    if (placementTestScore < 0 || placementTestScore > 100) {
        throw new Error("Invalid score");
    }

    if (placementTestScore >= 76) {
        return "MATH 109";
    } else if (placementTestScore >= 61) {
        return "MATH 108";
    } else if (placementTestScore >= 46) {
        return "MATH 105";
    } else {
        return "MATH 104";
    }
}
