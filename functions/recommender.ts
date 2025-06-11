export function getCSRec(credits: Set<string>, placementTestScore: number) {
    if (placementTestScore < 0 || placementTestScore > 100) {
        throw new Error("Invalid score");
    }

    // First recommend a course based on the placement test score
    let rec = null;
    if (placementTestScore >= 75) {
        rec = "CS 112";
    } else if (placementTestScore >= 40) {
        rec = "CS 111";
    } else {
        rec = "CS 110";
    }

    // If the user has credit for the recommended course, recommend the next course in the pathway
    const csPathway = ["CS 110", "CS 111", "CS 112", "CS 221"];
    while (credits.has(rec)) {
        const currentIndex = csPathway.indexOf(rec);
        if (currentIndex === -1 || currentIndex === csPathway.length - 1) return null; // No more courses to recommend
        rec = csPathway[currentIndex + 1];
    }

    return rec;
}

export function getCSMathRec(credits: Set<string>, placementTestScore: number) {
    if (placementTestScore < 0 || placementTestScore > 100) {
        throw new Error("Invalid score");
    }

    // First recommend a course based on the placement test score
    let rec = null;
    if (placementTestScore >= 76) {
        rec = "MATH 109";
    } else if (placementTestScore >= 61) {
        rec = "MATH 108";
    } else if (placementTestScore >= 46) {
        rec = "MATH 105";
    } else {
        rec = "MATH 104";
    }

    // If the user has credit for the recommended course, recommend the next course in the pathway
    const csMathPathway = ["MATH 104", "MATH 105", "MATH 108", "MATH 109", "MATH 201", "MATH 202"];
    while (credits.has(rec)) {
        const currentIndex = csMathPathway.indexOf(rec);
        if (currentIndex === -1 || currentIndex === csMathPathway.length - 1) return null; // No more courses to recommend
        rec = csMathPathway[currentIndex + 1];
    }

    return rec;
}
