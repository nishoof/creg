export type Test = {
    testName: string;
    testScore: number;
}

export type UserCredit = {
    _id: string;
    user: string;
    apCredit: Test[];
    completedCourses: string[];
    placementTests: Test[];
};

export async function getUserCredit(): Promise<UserCredit> {
    const username = localStorage.getItem("currentUser");
    if (!username) {
        throw new Error("User not logged in");
    }

    try {
        const response = await fetch(`/api/credits?username=${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user credit");
        }

        const data: UserCredit = await response.json();

        console.log(typeof data);
        console.log(data);

        return data;
    } catch (error) {
        console.log("Error fetching user credit:", error);
        throw new Error("Failed to fetch user credit");
    }
}