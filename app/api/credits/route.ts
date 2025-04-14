import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Env not configured with MONGODB_URI");
}
const client = new MongoClient(uri);

// Returns the placement and ap test data for the user
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        // Validate the request data
        if (!username || typeof username !== "string") {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        await client.connect();
        const database = client.db("c-reg_DB");
        const creditCollection = database.collection("credit");

        // Find the user in the collection
        const user = await creditCollection.findOne({ user: username });

        if (user) {
            // Return the user data
            return NextResponse.json(user, { status: 200 });
        } else {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error getting user credit:", error);
        return NextResponse.json({ error: "Failed to get user credit" }, { status: 500 });
    } finally {
        // Close the connection when done
        await client.close();
    }
}