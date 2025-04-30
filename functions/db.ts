import dotenv from "dotenv";
import { MongoClient } from "mongodb";

/**
 * Test represents a test taken by the user
 */
export type Test = {
    testName: string;
    testScore: number;
}

/**
 * Credit represents a USF course that the user has received credit for
 * The course is the USF course name, the source_type is where the credit came from (a specific AP test, placement test, etc.)
 */
export type Credit = {
    course: string;
    source: string;
}

/**
 * UserData represents the data for a user in the database
 */
export type UserData = {
    _id: string;
    username: string;
    apTests: Test[];
    placementTests: Test[];
    completedCourses: string[];
    credits: Credit[];
}

dotenv.config();
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Env not configured with MONGODB_URI");
}

const client = new MongoClient(uri);

// Returns the placement and ap test data for the user
export async function getUserData(username: string): Promise<UserData> {
    try {
        await client.connect();
        const database = client.db("creg-db");
        const creditCollection = database.collection("users");

        // Find the user in the collection
        const user = await creditCollection.findOne({ username: username });

        return user as unknown as UserData;
    } finally {
        await client.close();   // Close the connection when done
    }
}
