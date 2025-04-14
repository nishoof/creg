import { MongoClient } from "mongodb"
import { NextResponse } from "next/server"
import dotenv from "dotenv";

dotenv.config();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("Env not configured with MONGODB_URI");
    }
    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db("c-reg_DB")
    const usersCollection = db.collection("users")

    // Find user with matching username and password

    const user = await usersCollection.findOne({ name: username, password });
    

    await client.close()

    if (user) {
      return NextResponse.json({ success: true, username })
    } else {
      return NextResponse.json({ success: false, message: "Invalid username or password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

