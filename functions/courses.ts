const courseCodeToName: { [key: string]: string } = {
    "CS 110": "Intro to CS I (Python)",
    "CS 111": "Intro to CS I (Java)",
    "CS 112": "Intro to CS II (Java)",
    "CS 221": "C & Systems Programming",
    "CS 245": "Data Structures & Algorithms",
    "MATH 104": "Algebra for Business & Science",
    "MATH 105": "Mathematics for Educators",
    "MATH 108": "Precalculus",
    "MATH 109": "Calculus & Analytic Geom I",
    "MATH 201": "Discrete Mathematics",
    "MATH 202": "Linear Algebra & Probability",
    "RHET 103": "Public Speaking",
    "RHET 120": "Written Communication II",
}

const subjectCodeToName: { [key: string]: string } = {
    "CS": "Computer Science",
    "MATH": "Mathematics",
    "RHET": "Rhetoric and Composition",
}

/** 
 * Returns the full name of a course given its code.
 * If no course name was found, just returns the courseCode back.
 * 
 * For example, "CS 110" will return "CS 110: Intro to CS I (Python)".
*/
export function getCourseName(courseCode: string): string {
    const courseName = courseCodeToName[courseCode];
    if (!courseName) {
        console.warn(`Course name not found for course code: ${courseCode}`);
        return courseCode;
    }
    return courseCode + ": " + courseCodeToName[courseCode];
}

/**
 * Returns the full name of a subject given its code.
 * If no subject name was found, just returns the subjectCode back.
 * 
 * For example, "CS" will return "Computer Science".
*/
export function getSubjectName(subjectCode: string): string {
    const subjectName = subjectCodeToName[subjectCode];
    if (!subjectName) {
        console.warn(`Subject name not found for subject code: ${subjectCode}`);
        return subjectCode;
    }
    return subjectName;
}
