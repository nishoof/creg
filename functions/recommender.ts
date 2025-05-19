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

export function getCSMathRec(credits: Set<string>) {
    const csMathPathway = ["MATH 108", "MATH 109", "MATH 201", "MATH 202"];
    return getRecFromPathway(credits, csMathPathway);
}
