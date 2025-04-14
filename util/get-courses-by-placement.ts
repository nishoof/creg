export function getMathCourse(mathScore: number): string {
    if (mathScore < 0 || mathScore > 100)
        throw new Error("Score must be between 0 and 100");

    if (mathScore >= 76) {
        return "MATH 109: Calculus & Analytic Geom I";
    } else if (mathScore >= 68) {
        return "MATH 108: Precalculus or retake the test to place into MATH 109: Calculus & Analytic Geom I (recommended)";
    } else if (mathScore >= 61) {
        return "MATH 108: Precalculus";
    } else if (mathScore >= 46) {
        return "MATH 105: Mathematics for Educators";
    } else {
        return "MATH 104: Algebra for Business & Science";
    }
}

export function getComputerScienceCourse(csScore: number): string {
    if (csScore < 0 || csScore > 100)
        throw new Error("Score must be between 0 and 100");

    if (csScore >= 75) {
        return "CS 112: Intro to CS II (Java)";
    } else if (csScore >= 40) {
        return "CS 111: Intro to CS I (Java)";
    } else {
        return "CS 110: Intro to CS I (Python)";
    }
}

export function getChemistryCourse(chemScore: number): string {
    if (chemScore < 0 || chemScore > 100)
        throw new Error("Score must be between 0 and 100");

    if (chemScore >= 38) {
        return "CHEM 111: General Chemistry I (3 unit) & CHEM 112: Laboratory (1 unit)";
    } else {
        return "CHEM 111: General Chemistry I (3 unit) & CHEM 112: Laboratory (1 unit). Also concurrently register for CHEM 191: Peer-Led Team Learning (1 unit) to help you succeed in the course.";
    }
}