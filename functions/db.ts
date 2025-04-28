import dotenv from "dotenv";
import { MongoClient } from "mongodb";

export type Test = {
    testName: string;
    testScore: number;
}

export type UserData = {
    _id: string;
    username: string;
    apTests: Test[];
    placementTests: Test[];
    completedCourses: string[];
}

dotenv.config();
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Env not configured with MONGODB_URI");
}

const client = new MongoClient(uri);

// Returns the placement and ap test data for the user
export async function getUserData(username: string) {
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
