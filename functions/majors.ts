export const majors = [
    "Computer Science",
];

export function isValidMajor(major: string): boolean {
    return majors.includes(major);
}
