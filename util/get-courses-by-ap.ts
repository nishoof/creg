import { Test } from "@/util/get-user-credit";

export type ApTestCreditMap = {
    [key: string]: {
        score: number;
        credit: string;
    }
};

export const apTestCreditMap: ApTestCreditMap = {
    "AP African American Studies": { score: 3, credit: "General Elective" },
    "AP Art History": { score: 3, credit: "Visual and Performing Arts Core" },
    "AP Art: Studio Drawing": { score: 3, credit: "General Elective" },
    "AP Art: Studio General": { score: 3, credit: "General Elective" },
    "AP Art: 2D Design": { score: 3, credit: "General Elective" },
    "AP Art: 3D Design": { score: 3, credit: "General Elective" },
    "AP Biology": { score: 4, credit: "BIOL 100 and 103" },
    "AP Chemistry": { score: 4, credit: "CHEM 111 and 113" },
    "AP Chinese Language and Culture": { score: 3, credit: "Reach out to department to determine level." },
    "AP Computer Science A": { score: 3, credit: "CS 110" },
    "AP Computer Science AB": { score: 3, credit: "CS 110 and 112" },
    "AP Computer Science Principles": { score: 4, credit: "CS 107" },
    "AP Economics: Micro": { score: 3, credit: "ECON 111" },
    "AP Economics: Macro": { score: 3, credit: "ECON 112" },
    "AP English Language and Composition": { score: 4, credit: "General Elective" },
    "AP English Literature and Composition": { score: 3, credit: "Literature Core" },
    "AP Environmental Science": { score: 3, credit: "Science Core" },
    "AP European History": { score: 4, credit: "HIST 110" },
    "AP French Language": { score: 3, credit: "Reach out to department to determine level." },
    "AP Government & Politics: U.S.": { score: 3, credit: "Reach out to department to determine level." },
    "AP Government & Politics: Comparative": { score: 3, credit: "Reach out to department to determine level." },
    "AP German Language": { score: 3, credit: "Reach out to department to determine level." },
    "AP Human Geography": { score: 3, credit: "General Elective" },
    "AP Italian Language and Culture": { score: 3, credit: "Reach out to department to determine level." },
    "AP Japanese Language and Culture": { score: 3, credit: "Reach out to department to determine level." },
    "AP Latin": { score: 3, credit: "Reach out to department to determine level." },
    "AP Calculus AB": { score: 4, credit: "MATH 109" },
    "AP Calculus BC": { score: 4, credit: "MATH 109 and MATH 110" },
    "AP Calculus AB Subgrade": { score: 4, credit: "MATH 109" },
    "AP Music: Listening and Literature": { score: 3, credit: "General Elective" },
    "AP Music: Theory": { score: 3, credit: "General Elective" },
    "AP Physics B": { score: 3, credit: "PHYS 100 and PHYS 101" },
    "AP Physics C: Mechanics": { score: 3, credit: "PHYS 110" },
    "AP Physics C: Electricity and Magnetism": { score: 3, credit: "PHYS 210" },
    "AP Physics 1": { score: 3, credit: "PHYS 100" },
    "AP Physics 2": { score: 3, credit: "PHYS 101" },
    "AP Psychology": { score: 4, credit: "PSYC 101" },
    "AP Spanish Language": { score: 3, credit: "Reach out to department to determine level." },
    "AP Spanish Literature": { score: 3, credit: "Literature Core" },
    "AP Statistics": { score: 3, credit: "MATH 101" },
    "AP US History": { score: 4, credit: "HIST 120 US History Core" },
    "AP World History": { score: 4, credit: "General Elective" }
};

const csStarterMajorCourses = ["CS 110", "CS 111", "CS 112", "CS 221 & CS 245"];
const csStarterMathCourses = ["MATH 109", "MATH 201", "MATH 202"];

export function getUSFCourseEquivalentsFromAP(apTests: Test[]): string[] {
    const courses: string[] = [];
    for (const test of apTests) {
        const testName = test.testName;
        const testScore = test.testScore;

        if (!apTestCreditMap[testName])
            continue;

        const testCredit = apTestCreditMap[testName];
        if (testScore >= testCredit.score) {
            courses.push(testCredit.credit);
        }
    }
    return courses;
}

/*
  Example:
    75% Placement Test
    AP Calculus AB
*/

export function getCsMajorCourses(skippableCourses: string[]) {
    let csMajorCourseRecommendation: string | null = null;
    for (let i = csStarterMajorCourses.length - 2; i >= 0; i--) {
        const course = csStarterMajorCourses[i];
        if (skippableCourses.includes(course)) {
            const nextCourse = csStarterMajorCourses[i + 1];
            csMajorCourseRecommendation = nextCourse;
            break;
        }
    }
    if (csMajorCourseRecommendation === null) {
        csMajorCourseRecommendation = csStarterMajorCourses[0];
    }

    let mathCourseRecommendation: string | null = null;
    for (let i = csStarterMathCourses.length - 2; i >= 0; i--) {
        const course = csStarterMathCourses[i];
        if (skippableCourses.includes(course)) {
            const nextCourse = csStarterMathCourses[i + 1];
            mathCourseRecommendation = nextCourse;
            break;
        }
    }
    if (mathCourseRecommendation === null) {
        mathCourseRecommendation = csStarterMathCourses[0];
    }

    return { csMajorCourseRecommendation: csMajorCourseRecommendation, csMathCourseRecommendation: mathCourseRecommendation };
}