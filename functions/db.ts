"use server";

import mongoose, { connect, Document, Model } from "mongoose";
import { isValidMajor } from "./majors";

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Env not configured with MONGODB_URI");
}
await connect(uri);

export interface UserInterface extends Document {
    username: string;
    major: string;
    apTests: {
        testName: string;
        testScore: number;
    }[];
    placementTests: {
        testName: string;
        testScore: number;
    }[];
}

const UserSchema = new mongoose.Schema<UserInterface>({
    username: { type: String, required: true, unique: true },
    major: { type: String, required: false },
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
});

// Ensure the model isn't overwritten if it already exists
const User: Model<UserInterface> = (mongoose.models.User as Model<UserInterface>) || mongoose.model<UserInterface>("User", UserSchema);

export async function createUser(username: string) {
    console.log(`Creating user ${username}`);

    const existingUser: UserInterface | null = await User.findOne({ username: username });
    if (existingUser) {
        return;
    }

    const newUser = new User({ username: username });
    await newUser.save();
}

export async function getUserData(username: string): Promise<UserInterface> {
    /**
     * Implementation note: we use lean() to return a plain old JavaScript 
     * object (POJO) instead of a Mongoose document. This enables us to pass
     * the object from server to client (needs to be serializable)
     * 
     * @see https://mongoosejs.com/docs/tutorials/lean.html
     */

    const user = await User.findOne({ username: username }).lean();
    if (user)
        return JSON.parse(JSON.stringify(user));
    await createUser(username);
    return await getUserData(username);
}

export async function updateUserMajor(username: string, major: string) {
    console.log(`Updating user ${username} major to ${major}`);

    // Make sure the major is valid
    if (!isValidMajor(major)) {
        throw new Error(`Invalid major: ${major}`);
    }

    // Find the user in the database
    const user = await User.findOne({ username: username });

    // If the user does not exist, create the user and restart the process
    if (!user) {
        await createUser(username);
        return updateUserMajor(username, major);
    }

    // Update the user's major
    user.major = major;
    await user.save();
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
        await user.save();
        return "UPDATED";
    }

    // Otherwise, add the new test to the user's apTests array
    user.apTests.push(test);
    await user.save();
    return "ADDED";
}

export async function addPlacementTests(username: string, tests: { testName: string; testScore: number }[]) {
    console.log(`Adding placement tests for user ${username}`);

    // Find the user in the database
    const user = await User.findOne({ username: username });

    // If the user does not exist, create the user and restart the process
    if (!user) {
        await createUser(username);
        return addPlacementTests(username, tests);
    }

    // Add each test
    for (const test of tests) {
        // If the test already exists, update its score. Otherwise, add it
        const existingTest = user.placementTests.find((t) => t.testName === test.testName);
        if (existingTest) {
            existingTest.testScore = test.testScore;
        } else {
            user.placementTests.push(test);
        }
    }

    await user.save();
}
