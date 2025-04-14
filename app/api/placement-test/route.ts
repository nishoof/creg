import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Env not configured with MONGODB_URI");
}
const client = new MongoClient(uri);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, placementTestName, placementTestScore } = body;

        // Validate the request data
        if (!username || typeof username !== "string"
            || !placementTestName || typeof placementTestName !== "string"
            || typeof placementTestScore !== "number" || placementTestScore < 0 || placementTestScore > 100) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        await client.connect();
        const database = client.db("c-reg_DB");
        const creditCollection = database.collection("credit");

        // Find the user in the collection
        const user = await creditCollection.findOne({ user: username });

        if (user) {
            // Check if the user already has the placement test in their document
            const existingPlacementTest = user.placementTests.find((test: { testName: string; testScore: number }) => test.testName === placementTestName);

            // If the placement test already exists, update the score
            // If the placement test doesn't exist, add it to the array
            if (existingPlacementTest) {
                await creditCollection.updateOne(
                    { user: username, "placementTests.testName": placementTestName },
                    { $set: { "placementTests.$.testScore": placementTestScore } } // Update the score of the existing placement test
                );
            } else {
                await creditCollection.updateOne(
                    { user: username },
                    { $addToSet: { placementTests: { testName: placementTestName, testScore: placementTestScore } } }
                );
            }
        } else {
            // If user doesn't exist, create a new document
            await creditCollection.insertOne({
                user: username,
                apCredit: [],
                completedCourses: [],
                placementTests: [{ testName: placementTestName, testScore: placementTestScore }], // Add the placement test object
            });
        }

        return NextResponse.json({ success: true, message: "Successfully added placement test to the account." }, { status: 201 });
    } catch (error) {
        console.error("Error adding placement test:", error);
        return NextResponse.json({ error: "Failed to add placement test" }, { status: 500 });
    } finally {
        // Close the connection when done
        await client.close();
    }
}