import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request: Request) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Env not configured with MONGODB_URI");
  }
  const client = new MongoClient(uri);

  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const college = searchParams.get("college") || "";
    const subject = searchParams.get("subject") || ""; // <--- NEW
    const hasPrerequisites = searchParams.get("hasPrerequisites") || "";
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10");

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;

    await client.connect();
    const database = client.db("c-reg_DB");
    const coursesCollection = database.collection("courses");

    // Get all unique college values for the filter dropdown
    const collegesResult = await coursesCollection.distinct("college");
    const colleges = collegesResult.filter(
      (college) => college && typeof college === "string"
    );


    // Get all unique subject values for the filter dropdown
    const subjectsResult = await coursesCollection.distinct("subject"); // <--- NEW
    const subjects = subjectsResult.filter(
      (subj) => subj && typeof subj === "string"
    );

    // Build search query
    const query: any = {};

    // Search term (across multiple fields)
    if (search) {
      query.$or = [
        { course_code: { $regex: search, $options: "i" } },
        { course_title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // College filter
    if (college) {
      query.college = college;
    }

    // Subject filter (replaces the old "restrictions" filter)
    if (subject) {
      query.subject = subject;
    }

    // Prerequisites filter
    if (hasPrerequisites === "yes") {
      query.prerequisites = { $ne: "" };
    } else if (hasPrerequisites === "no") {
      query.prerequisites = "";
    }

    // Get total count for pagination
    const totalCount = await coursesCollection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    // Execute query with pagination
    const courses = await coursesCollection
      .find(query)
      .sort({ course_code: 1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    return NextResponse.json(
      {
        courses,
        colleges,
        subjects,
        currentPage: page,
        totalPages,
        totalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  } finally {
    // Close the connection when done
    await client.close();
  }
}
