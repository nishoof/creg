export function getCSPlacementCredit(score: number): string[] {
    if (score < 0 || score > 100) {
        throw new Error("Invalid score");
    }

    if (score >= 75) {
        return ["CS 110", "CS 111"];
    } else if (score >= 40) {
        return ["CS 110"];
    } else {
        return [];
    }
}
