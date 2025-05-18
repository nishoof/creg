import OpenAI from "openai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages } = await req.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array required" },
        { status: 400 }
      );
    }

    console.log("User message:", messages[messages.length - 1]?.content);

    // Context
    const systemPrompt = {
      role: "system",
      content: "You are a helpful chatbot assistant helping students at the University of San Francisco with registration. Answer questions accurately and concisely (1-3 sentences). This website that you are a chatbot on is meant to provide information for new students to USF. The links at the top of the page are: First Year Information (where the user should get started to see the steps they need to take), AP Credit (shows what credit students can get for the AP tests they took, which can be saved to the user's account), Placement Tests (shows what courses the student is elegible for, which can also be saved to the user's account), and Course Recommendations (shows what courses the student should take next). Encourage users to add their test information and check their recommended classes. Give all your answers in plain text. Do not use markdown or code blocks. Provide links to resources when appropriate.",
    };

    const knowledgeBase = {
      role: "system",
      content: "To earn a Bachelor of Arts (BA) or Bachelor of Science (BS) degree from the College of Arts and Sciences, students must complete at least 128 total credits, including the Core Curriculum, all major requirements, and a language requirement. At least 44 credits must be completed at USF, including the final 32 credits and at least 16 upper-division credits in the major. If completing a minor, at least half of the minor credits must be completed at USF. Students must maintain a minimum cumulative GPA of C (2.0) and earn at least a C average in all major and minor courses. To stay on track for four-year graduation (8 semesters), students should take 16 credits per semester. The Core Curriculum consists of 11 courses (44 credits) that provide a liberal arts foundation and must include one course in each of the following areas: A1 Public Speaking, A2 Rhetoric and Composition, B1 Mathematics, B2 Science, C1 Literature, C2 History, D1 Philosophy, D2 Theology, D3 Ethics, E Social Sciences, F Visual & Performing Arts. Students need to also fulfill their foreign language, Community Engaged Learning, and Cultural Diversity requirements. The foreign language requirement varies by school. Bachelor of Arts need 3 consecutive semesters of the same language. Backelor of Science need 2 consecutive semesters of the same language. For the School of Management, only students completing the Bachelor of Science in Business Administration majoring in International Business have a language requirement: three consecutive semesters of the same language. School of Nursing and Health Professions do not have the foreign language requirement. The Community-Engaged Learning (CEL) requirement must be completed by completing 4 units of CEL course work, typically one 4 unit class with the CEL attribute. The Cultural Diversity (CD) requirement must be completed by completing one class with the CD attribute. There are many classes that fullfil both a core requirement or major requirement in addition to either the CEL or CD requirement. Many placement tests can be taken online prior to coming to campus. Please take them before you register for classes. Placement test info can be found at https://myusf.usfca.edu/newstudentregistration/placement-tests. The Directed Self Placement (DSP) is not a test. Instead, it's an activity you complete on your own to determine which Rhetoric writing (A2) course will be the best fit for you. Students in the Martín-Baró Scholars program and students who will be completing Academic English for Multilingual Students (AEM) courses at USF do not need to take the DSP. We award credit from Advanced Placement, International Baccalaureate, or other college-level courses. It's a great way to fulfill some college degree requirements right off the bat. More info can be found at https://www.usfca.edu/admission/undergraduate/ap-ib-college-credit. myUSF is an online portal where you can register for classes, pay tuition, access USF email, view your student record, and update contact information. Canvas is an online learning platform containing your courses, assignments, and instructor information. Banner Self-Service is where you'll register for classes, view your degree evaluation, accept financial aid, and more. Degree Evaluation showcases your specific degree requirements and includes any past, in-progress, and planned coursework. Student Hub is used to contact or make appointments with your Academic Success Coach and see your to-do list and class schedule.",
    };

    const userContext = {
      role: "system",
      content: "The user is a new undergraduate student at the University of San Francisco.",
    };

    const errorHandling = {
      role: "system",
      content: "If you are unsure about an answer, politely inform the user and suggest they contact the registrar's office, their CASA coach, or major advisor for further assistance.",
    };

    // Combine system prompt, knowledge base, and user messages
    const fullMessages = [systemPrompt, knowledgeBase, userContext, errorHandling, ...messages];

    // Use the non-streaming approach to get the response
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: fullMessages,
    });

    // Create a response with the assistant's message
    const responseMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: completion.choices[0].message.content ?? "",
    };

    // Return a standard JSON response
    return NextResponse.json(responseMessage);

  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}