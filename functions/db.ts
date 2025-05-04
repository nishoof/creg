import dotenv from "dotenv";
import mongoose, { connect, Document, Model, mongo } from "mongoose";
import { getApCredit } from "./credit-ap";
import { getCSPlacementCredit } from "./credit-placement";

dotenv.config();
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Env not configured with MONGODB_URI");
}
await connect(uri);

export interface UserInterface extends Document {
    username: string;
    apTests: {
        testName: string;
        testScore: number;
    }[];
    placementTests: {
        testName: string;
        testScore: number;
    }[];
    completedCourses: string[];
    credits: {
        course: string;
        source: string;
    }[];
}

const UserSchema = new mongoose.Schema<UserInterface>({
    username: { type: String, required: true, unique: true },
    apTests: [
        {
            testName: { type: String, required: true },
            testScore: { type: Number, required: true }
        }
    ],
    placementTests: [
        {
            testName: { type: String, required: true },
            testScore: { type: Number, required: true }
        }
    ],
    completedCourses: [String],
    credits: [
        {
            course: { type: String, required: true },
            source: { type: String, required: true }
        }
    ]
});

// Ensure the model isn't overwritten if it already exists
const User: Model<UserInterface> = (mongoose.models.User as Model<UserInterface>) || mongoose.model<UserInterface>("User", UserSchema);

async function addCredit(user: (mongoose.Document<any, any, UserInterface> & UserInterface), credits: { course: string; source: string }) {
    // Check if the user already has the credits
    const existingCreditsCourses = user.credits.map((credit) => credit.course);
    if (existingCreditsCourses.includes(credits.course)) {
        console.log(`User ${user.username} already has credit for ${credits.course}`);
        return;
    }

    // Add the new credits to the user's credits array
    user.credits.push(credits);
    console.log(`Added credit for ${credits.course} to user ${user.username}`);
}

export async function createUser(username: string) {
    console.log(`Creating user ${username}`);

    const existingUser: UserInterface | null = await User.findOne({ username: username });
    if (existingUser) {
        return;
    }

    const newUser = new User({ username: username });
    await newUser.save();
}

export async function getUserData(username: string): Promise<UserInterface | null> {
    const user = await User.findOne({ username: username });
    return user;
}

export async function addAPTest(username: string, test: { testName: string; testScore: number }) {
    console.log(`Adding AP test ${test.testName} for user ${username}`);

    // Find the user in the database
    const user = await User.findOne({ username: username });

    // If the user does not exist, create the user and restart the process
    if (!user) {
        await createUser(username);
        return addAPTest(username, test);
    }

    // Check if an AP test with the same name already exists for the user
    const existingTest = user.apTests.find((t) => t.testName === test.testName);

    // If so, update its score
    if (existingTest) {
        existingTest.testScore = test.testScore;
        const credits = getApCredit(test.testName, test.testScore);
        if (credits.length > 0) {
            // Add the credit to the user's credits array
            const creditsWithSource = credits.map((c) => ({ course: c, source: test.testName }));   // proper format for the database
            for (const credit of creditsWithSource) {
                await addCredit(user, credit);
            }
        }
        await user.save();
        return;
    }

    // Otherwise, add the new test to the user's apTests array
    user.apTests.push(test);
    await user.save();
}

export async function addPlacementTest(username: string, test: { testName: string; testScore: number }) {
    console.log(`Adding placement test ${test.testName} for user ${username}`);

    // Find the user in the database
    const user = await User.findOne({ username: username });

    // If the user does not exist, create the user and restart the process
    if (!user) {
        await createUser(username);
        return addPlacementTest(username, test);
    }

    // Check if a placement test with the same name already exists for the user
    const existingTest = user.placementTests.find((t) => t.testName === test.testName);

    // If so, update its score
    if (existingTest) {
        existingTest.testScore = test.testScore;

        // Add credit for CS placement tests
        if (test.testName === "CS Placement") {
            const credits = getCSPlacementCredit(test.testScore);
            if (credits.length > 0) {
                // Add the credit to the user's credits array
                const creditsWithSource = credits.map((c) => ({ course: c, source: test.testName }));   // proper format for the database
                for (const credit of creditsWithSource) {
                    await addCredit(user, credit);
                }
            }
        }

        await user.save();
        return;
    }

    // Otherwise, add the new test to the user's placementTests array
    user.placementTests.push(test);
    await user.save();
}
