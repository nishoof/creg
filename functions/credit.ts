/** Represents a test (such as an ap test or placement test) with a test name and test score */
export interface Test {
    testName: string;
    testScore: number;
}

/** Maps AP test names to their corresponding credit information */
export const apTestCredit: { [key: string]: { score: number; credit: string[] } } = {
    "AP African American Studies": { score: 3, credit: ["General Elective"] },
    "AP Art History": { score: 3, credit: ["Visual and Performing Arts Core"] },
    "AP Art: Studio Drawing": { score: 3, credit: ["General Elective"] },
    "AP Art: Studio General": { score: 3, credit: ["General Elective"] },
    "AP Art: 2D Design": { score: 3, credit: ["General Elective"] },
    "AP Art: 3D Design": { score: 3, credit: ["General Elective"] },
    "AP Biology": { score: 4, credit: ["BIOL 100", "BIOL 103"] },
    "AP Chemistry": { score: 4, credit: ["CHEM 111", "CHEM 113"] },
    "AP Chinese Language and Culture": { score: 3, credit: ["Reach out to department to determine level."] },
    "AP Computer Science A": { score: 3, credit: ["CS 110"] },
    "AP Computer Science AB": { score: 3, credit: ["CS 110", "CS 112"] },
    "AP Computer Science Principles": { score: 4, credit: ["CS 107"] },
    "AP Economics: Micro": { score: 3, credit: ["ECON 111"] },
    "AP Economics: Macro": { score: 3, credit: ["ECON 112"] },
    "AP English Language and Composition": { score: 4, credit: ["General Elective"] },
    "AP English Literature and Composition": { score: 3, credit: ["Literature Core"] },
    "AP Environmental Science": { score: 3, credit: ["Science Core"] },
    "AP European History": { score: 4, credit: ["HIST 110"] },
    "AP French Language": { score: 3, credit: ["Reach out to department to determine level."] },
    "AP Government & Politics: U.S.": { score: 3, credit: ["Reach out to department to determine level."] },
    "AP Government & Politics: Comparative": { score: 3, credit: ["Reach out to department to determine level."] },
    "AP German Language": { score: 3, credit: ["Reach out to department to determine level."] },
    "AP Human Geography": { score: 3, credit: ["General Elective"] },
    "AP Italian Language and Culture": { score: 3, credit: ["Reach out to department to determine level."] },
    "AP Japanese Language and Culture": { score: 3, credit: ["Reach out to department to determine level."] },
    "AP Latin": { score: 3, credit: ["Reach out to department to determine level."] },
    "AP Calculus AB": { score: 4, credit: ["MATH 109"] },
    "AP Calculus BC": { score: 4, credit: ["MATH 109", "MATH 110"] },
    "AP Calculus AB Subgrade": { score: 4, credit: ["MATH 109"] },
    "AP Music: Listening and Literature": { score: 3, credit: ["General Elective"] },
    "AP Music: Theory": { score: 3, credit: ["General Elective"] },
    "AP Physics B": { score: 3, credit: ["PHYS 100", "PHYS 101"] },
    "AP Physics C: Mechanics": { score: 3, credit: ["PHYS 110"] },
    "AP Physics C: Electricity and Magnetism": { score: 3, credit: ["PHYS 210"] },
    "AP Physics 1": { score: 3, credit: ["PHYS 100"] },
    "AP Physics 2": { score: 3, credit: ["PHYS 101"] },
    "AP Psychology": { score: 4, credit: ["PSYC 101"] },
    "AP Spanish Language": { score: 3, credit: ["Reach out to department to determine level."] },
    "AP Spanish Literature": { score: 3, credit: ["Literature Core"] },
    "AP Statistics": { score: 3, credit: ["MATH 101"] },
    "AP US History": { score: 4, credit: ["HIST 120"] },
    "AP World History": { score: 4, credit: ["General Elective"] }
};

/** List of all known AP test names */
export const apTests = Object.keys(apTestCredit);

/** Enum of all known placement test names */
export enum PlacementTest {
    // Note: these are the names of placement tests in the databse, and are also displayed to the user
    CSPlacement = "Computer Science",
    MathPlacement = "Math",
    SpanishLanguagePlacement = "Spanish",
    FrenchLanguagePlacement = "French",
    GermanLanguagePlacement = "German",
    ItalianLanguagePlacement = "Italian"
}

export function isLanguagePlacementTest(testName: string): boolean {
    return testName === PlacementTest.SpanishLanguagePlacement ||
        testName === PlacementTest.FrenchLanguagePlacement ||
        testName === PlacementTest.GermanLanguagePlacement ||
        testName === PlacementTest.ItalianLanguagePlacement;
}

/** Returns the credits for a list of AP tests. */
export function getApCredit(apTests: Test[]) {
    const credits: Set<string> = new Set();

    for (const test of apTests) {
        const credit = getSingleApCredit(test.testName, test.testScore);
        for (const c of credit) {
            credits.add(c);
        }
    }

    return credits;
}

/** Returns the credit for a single AP test and score. */
function getSingleApCredit(apTest: string, score: number) {
    const test = apTestCredit[apTest];
    if (!test) return [];
    if (score < test.score) return [];
    return test.credit;
}
