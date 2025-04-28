import { getApCredit } from "./credit-ap";
import { getCSPlacementCredit } from "./credit-placement";
import { getUserData, UserData } from "./db";

const csPathway = ["CS110", "CS111", "CS112", "CS221", "CS245"];

function getCredit(userdata: UserData) {
    const credit = new Set<string>();

    for (const course of userdata.completedCourses) {
        credit.add(course);
    }

    const placementTests = userdata.placementTests;
    for (const placementTest of placementTests) {
        const creditFromTest = getCSPlacementCredit(placementTest.testScore);
        if (creditFromTest.length == 0) continue;
        for (const course of creditFromTest) {
            credit.add(course);
        }
    }

    const apTests = userdata.apTests;
    for (const apTest of apTests) {
        const creditFromTest = getApCredit(apTest.testName, apTest.testScore);
        if (creditFromTest.length == 0) continue;
        for (const course of creditFromTest) {
            credit.add(course);
        }
    }

    return credit;
}

export async function getCourseRecommendations(email: string) {
    const username = email.split("@")[0];
    const userdata = await getUserData(username);

    const credit = getCredit(userdata);

    for (const course of csPathway) {
        if (credit.has(course)) continue;

        return course;
    }

    return null;
}
