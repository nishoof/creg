import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import dotenv from "dotenv";
dotenv.config();

// MongoDB connection string should be in your environment variables
const uri = process.env.MONGODB_URI 
if (!uri) {
    throw new Error("Env not configured with MONGODB_URI");
}


export async function GET(request: Request) {
  if (!uri) {
      throw new Error("Env not configured with MONGODB_URI");
  }
  const client = new MongoClient(uri)
  
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const sort = searchParams.get("sort") || "course"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize

    await client.connect()
    const database = client.db("c-reg_DB")
    const sectionsCollection = database.collection("sections")

    // Build search query
    let query = {}
    if (search) {
      // Create a text search query that looks in multiple fields
      query = {
        $or: [
          { course: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { instructor_first: { $regex: search, $options: "i" } },
          { instructor_last: { $regex: search, $options: "i" } },
          { building: { $regex: search, $options: "i" } },
          { room: { $regex: search, $options: "i" } },
          { college: { $regex: search, $options: "i" } },
          ...(/^\d+$/.test(search) ? [{ crn: parseInt(search) }] : [])
        ],
      }
    }


    // Get total count for pagination
    const totalCount = await sectionsCollection.countDocuments(query)
    const totalPages = Math.ceil(totalCount / pageSize)

    // Execute query with pagination
    const sections = await sectionsCollection.find(query).skip(skip).limit(pageSize).toArray()

    return NextResponse.json(
      {
        sections,
        currentPage: page,
        totalPages,
        totalCount,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching sections:", error)
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 })
  } finally {
    client.close();
  }

}

