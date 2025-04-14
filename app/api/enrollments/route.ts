import { NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

export async function POST(request: Request) {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("Env not configured with MONGODB_URI")
  }
  const client = new MongoClient(uri)

  try {
    const body = await request.json()
    const { username, sections } = body

    if (!username || !sections || !Array.isArray(sections)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    await client.connect()
    const database = client.db("c-reg_DB")
    const enrollmentsCollection = database.collection("enrollments")
    const sectionsCollection = database.collection("sections")

    // Convert section IDs to ObjectId
    const sectionObjectIds = sections.map((id) => new ObjectId(id))

    // Get section details
    const sectionDetails = await sectionsCollection.find({
      _id: { $in: sectionObjectIds },
    }).toArray()

    // Get CRNs from sectionDetails
    const newCrns = sectionDetails.map((section) => section.crn)

    // Check enrollment limit first
    const existingRecord = await enrollmentsCollection.findOne({ username })
    if (existingRecord) {
      const combinedCrns = [...new Set([...existingRecord.enrollments, ...newCrns])]
      if (combinedCrns.length > 5) {
        return NextResponse.json(
          { error: "Enrollment exceeds maximum allowed sections (5)" },
          { status: 400 }
        )
      }
    } else {
      if (newCrns.length > 5) {
        return NextResponse.json(
          { error: "Enrollment exceeds maximum allowed sections (5)" },
          { status: 400 }
        )
      }
    }

    // Then check if any section is at capacity
    // (Note: "capacity" is actually the "enrolled" field in your logic)
    const atCapacitySections = sectionDetails.filter(
      (section) => section.enrollment <= section.capacity
    )
    if (atCapacitySections.length > 0) {
      return NextResponse.json(
        {
          error: "One or more sections are at capacity",
          sections: atCapacitySections.map((s) => s.course),
        },
        { status: 400 }
      )
    }

    // Update or create enrollment record
    if (existingRecord) {
      const combinedCrns = [...new Set([...existingRecord.enrollments, ...newCrns])]
      await enrollmentsCollection.updateOne(
        { username },
        {
          $set: {
            enrollments: combinedCrns,
            enrolled_date: new Date(),
          },
        }
      )
    } else {
      const newRecord = {
        username,
        enrollments: newCrns,
        enrolled_date: new Date(),
      }
      await enrollmentsCollection.insertOne(newRecord)
    }

    // Update section "capacity" (which is actually your "enrollment count")
    for (const sectionId of sectionObjectIds) {
      await sectionsCollection.updateOne({ _id: sectionId }, { $inc: { capacity: 1 } })
    }

    return NextResponse.json(
      { success: true, message: "Successfully enrolled in classes" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating enrollments:", error)
    return NextResponse.json({ error: "Failed to create enrollments" }, { status: 500 })
  } finally {
    await client.close()
  }
}

// GET: fetch user's enrollments
export async function GET(request: Request) {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("Env not configured with MONGODB_URI")
  }
  const client = new MongoClient(uri)

  try {
    const url = new URL(request.url)
    const username = url.searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    await client.connect()
    const database = client.db("c-reg_DB")
    const enrollmentsCollection = database.collection("enrollments")
    const sectionsCollection = database.collection("sections")

    const enrollment = await enrollmentsCollection.findOne({ username })
    if (!enrollment) {
      return NextResponse.json({ error: "No enrollments found for user" }, { status: 404 })
    }

    const sections = await sectionsCollection
      .find({ crn: { $in: enrollment.enrollments } })
      .toArray()

    return NextResponse.json(
      {
        username: enrollment.username,
        enrolled_date: enrollment.enrolled_date,
        sections,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  } finally {
    await client.close()
  }
}

// NEW: DELETE: drop a single enrolled course
export async function DELETE(request: Request) {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("Env not configured with MONGODB_URI")
  }
  const client = new MongoClient(uri)

  try {
    const { username, sectionId } = await request.json()
    if (!username || !sectionId) {
      return NextResponse.json({ error: "username and sectionId required" }, { status: 400 })
    }

    await client.connect()
    const database = client.db("c-reg_DB")
    const enrollmentsCollection = database.collection("enrollments")
    const sectionsCollection = database.collection("sections")

    // 1) Find the user’s enrollment
    const userEnrollment = await enrollmentsCollection.findOne({ username })
    if (!userEnrollment) {
      return NextResponse.json(
        { error: "No enrollment record found for this user" },
        { status: 404 }
      )
    }

    // 2) Find the CRN associated with this sectionId
    const section = await sectionsCollection.findOne({ _id: new ObjectId(sectionId) })
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    // 3) Filter out the CRN from the user’s enrollments
    const newEnrollmentList = userEnrollment.enrollments.filter((crn: number) => crn !== section.crn)

    // If the CRN wasn't in their enrollments
    if (newEnrollmentList.length === userEnrollment.enrollments.length) {
      return NextResponse.json(
        { error: "User is not enrolled in that section" },
        { status: 400 }
      )
    }

    // 4) Update the user’s enrollment record
    await enrollmentsCollection.updateOne(
      { username },
      { $set: { enrollments: newEnrollmentList } }
    )

    // 5) Decrement the "capacity" field (since you said you store actual enrollment in capacity)
    await sectionsCollection.updateOne(
      { _id: new ObjectId(sectionId) },
      { $inc: { capacity: -1 } }
    )

    return NextResponse.json({ success: true, message: "Course dropped successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error dropping course:", error)
    return NextResponse.json({ error: "Failed to drop course" }, { status: 500 })
  } finally {
    await client.close()
  }
}
