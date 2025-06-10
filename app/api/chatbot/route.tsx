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
      content: "You are a helpful chatbot assistant helping students at the University of San Francisco with registration. Answer questions accurately and concisely (1-3 sentences). This website that you are a chatbot on is meant to provide information for new students to USF. The links at the top of the page are: Getting Started (where the user should get started to see the first steps they need to take), AP Credit (shows what credit students can get for the AP tests they took, which can be saved to the user's account), Placement Tests (shows what courses the student is elegible for, which can also be saved to the user's account), and Course Recommendations (shows what courses the student should take next). Encourage users to add their test information and check their recommended classes. Give all your answers in plain text. Do not use markdown or code blocks. Provide links to resources when appropriate.",
    };

    const userContext = {
      role: "system",
      content: "The user is a new undergraduate student at the University of San Francisco.",
    };

    const knowledgeBase = {
      role: "system",
      content: "To earn a Bachelor of Arts (BA) or Bachelor of Science (BS) degree from the College of Arts and Sciences, students must complete at least 128 total credits, including the Core Curriculum, all major requirements, and a language requirement. At least 44 credits must be completed at USF, including the final 32 credits and at least 16 upper-division credits in the major. If completing a minor, at least half of the minor credits must be completed at USF. Students must maintain a minimum cumulative GPA of C (2.0) and earn at least a C average in all major and minor courses. To stay on track for four-year graduation (8 semesters), students should take 16 credits per semester. The Core Curriculum consists of 11 courses (44 credits) that provide a liberal arts foundation and must include one course in each of the following areas: A1 Public Speaking, A2 Rhetoric and Composition, B1 Mathematics, B2 Science, C1 Literature, C2 History, D1 Philosophy, D2 Theology, D3 Ethics, E Social Sciences, F Visual & Performing Arts. Students need to also fulfill their foreign language, Community Engaged Learning, and Cultural Diversity requirements. The foreign language requirement varies by school. Bachelor of Arts need 3 consecutive semesters of the same language. Backelor of Science need 2 consecutive semesters of the same language. For the School of Management, only students completing the Bachelor of Science in Business Administration majoring in International Business have a language requirement: three consecutive semesters of the same language. School of Nursing and Health Professions do not have the foreign language requirement. The Community-Engaged Learning (CEL) requirement must be completed by completing 4 units of CEL course work, typically one 4 unit class with the CEL attribute. The Cultural Diversity (CD) requirement must be completed by completing one class with the CD attribute. There are many classes that fullfil both a core requirement or major requirement in addition to either the CEL or CD requirement. Many placement tests can be taken online prior to coming to campus. Please take them before you register for classes. Placement test info can be found at https://myusf.usfca.edu/newstudentregistration/placement-tests. The Directed Self Placement (DSP) is not a test. Instead, it's an activity you complete on your own to determine which Rhetoric writing (A2) course will be the best fit for you. Students in the Martín-Baró Scholars program and students who will be completing Academic English for Multilingual Students (AEM) courses at USF do not need to take the DSP. We award credit from Advanced Placement, International Baccalaureate, or other college-level courses. It's a great way to fulfill some college degree requirements right off the bat. More info can be found at https://www.usfca.edu/admission/undergraduate/ap-ib-college-credit. myUSF is an online portal where you can register for classes, pay tuition, access USF email, view your student record, and update contact information. Canvas is an online learning platform containing your courses, assignments, and instructor information. Banner Self-Service is where you'll register for classes, view your degree evaluation, accept financial aid, and more. Degree Evaluation showcases your specific degree requirements and includes any past, in-progress, and planned coursework. Student Hub is used to contact or make appointments with your Academic Success Coach and see your to-do list and class schedule.",
    };

    const faq = {
      role: "system",
      content: "Here's some frequently asked questions and answers that may help you: Q1: I just took my Spanish placement test today. Will I still be able to take a Spanish class if I don't get the results before registration opens? A1: Placement test results for Spanish/French/German/Italian can take two weeks to come in, so you can leave space in your schedule for the language class once you receive your results. Q2: If I want to take a language I don't know or have never studied before, do I still have to take the language placement test? A2: If you want to start a new language, you can simply register for the 101 level of that class with the practicum associated with it. No need to take a placement test. The placement test is for students who wish to register for a higher level of language course. Q3: Do you have to take the course that the Rhetoric placement process (Directed Self-Placement [DSP]) suggests? A3: No, not necessarily. The DSP makes a suggestion, but you may select any course that you want. For instance, you may wish to take a more advanced course or one that goes at a slightly slower pace than the one recommended. However, once you select the course in the DSP process, you will be cleared only for that course. For example, if we suggest 110, you may select 110 OR another course -- say, 106N. You will be cleared to register for whichever you select at that point in the self-placement process. Q4: Is the Rhetoric placement process (DSP) required? Or just suggested? A4: For first year students and transfer students without prior college composition credit, it is required. (It is strongly encouraged for transfer students with prior credit.) Also, please know that it is not a test. It is a process to help you select a course that you think best fits your needs. You will answer survey questions, practice some writing, hear about our course offerings, and reflect on your decision. Then you will select which course you think is best for you. Q5: Could I take placement tests to test out of core classes and skip having to fill those credits? A5: You may be able to satisfy Core requirements with AP or IB credits. You can find more information here: https://www.usfca.edu/admission/undergraduate/first-year/ap-ib-college-credit Q6: How many classes/units should a first-year student take? A6: Students typically take 16 units per semester, though you can take up to 18 units for the same price. You should register for 12 units to be considered a full-time student. Q7: Who should I reach out to in order to get help with classes to register for? A7: School of Nursing and Health Professions: Check your USF email for communication from SONHP Undergraduate Student Services. Otherwise, email Stacey Kohut at sekohut1@usfca.edu. School of Management: Contact the Office of Undergraduate Studies (first-years) or Ben Bottorff (transfers) at bbbottorff@usfca.edu. College of Arts and Sciences: Check your email or contact newstudentregistration@usfca.edu. Q8: How do I change my major? A8: You can use the Change of Academic Program form at https://myusf.usfca.edu/registration/change-academic-program-instructions. You'll still receive info from your current major until the change is processed. You can't change your major to nursing if you weren't admitted as such. Q9: Is foreign language a requirement to graduate? A9: It depends on your major. Most majors require a foreign language except for the School of Nursing and Health Professions and most School of Management programs. Q10: Who do I have to contact to declare a minor and choose classes for that? A10: Refer to https://myusf.usfca.edu/casa/explore-your-path/declare-major or speak with your academic success coach. Q11: Are there any classes that are a requirement to take? A11: Yes, you'll need to complete the Core Curriculum, all required and elective courses for your major, and any other electives needed to graduate. Q12: Are there certain core classes that should be taken sooner than others? A12: It's recommended to take your rhetoric writing requirement early. Choose courses that interest you! Q13: Can you register for classes outside of your major such as a class from School of Management or a class from School of Nursing? A13: Many of those classes are restricted to students in those programs. You'll need permission from the professor to register. Q14: Are your major advisor and academic success coach the same person? A14: No. Major advisors are faculty who help with courses and graduation requirements. Academic success coaches support your transition, help explore majors/minors, and connect you to resources. Q15: Can freshmen take 200-level classes? A15: Yes, they are considered lower-division courses. Q16: Are we required to take a foreign language course in our first semester? A16: No, though it might be recommended if your placement is high or your major advises it. Q17: What does 3rd-semester language proficiency mean? A17: You must complete up to the third semester of a language. For example, Spanish 101, 102, and 201. Q18: Could you explain more about the different Rhet classes and how they differ by pathways? And how to know which is the best fit to select for yourself? A18: That's all addressed in the Directed Self-Placement process. Most first-years take RHET 110 followed by RHET 120 or another A2 credit. Transfer students often take RHET 250. Email rhetoricandlanguage@usfca.edu for help. Q19: Do classes usually fill up fast? A19: Some do, but all students get the classes they need. Be flexible and you'll find a good schedule. Q20: What class should we choose when we don't know our AP/IB scores yet, meaning we don't know where we would place yet? A20: Avoid registering for possible repeat classes. Wait for scores if they could apply to your major or core. Q21: After we receive our scores, how do we know what class to take if we earned the credit? A21: Check: https://www.usfca.edu/admission/undergraduate/first-year/ap-ib-college-credit Q22: I did the IB diploma and await results. If I get 30 credits, does it mean I do fewer classes? A22: Yes, those may count toward core and electives, allowing faster progress toward graduation. Q23: Where do I send my high school transcript? A23: Follow the instructions in Section 2, Slide 6/19 of the 'Important Next Steps' module. Q24: When can I register for fall classes? A24: If you deposited before or at Destination USF on April 12, you can register early on April 23 at 10 a.m. PT. Q25: How do I find my CWID? A25: It's on your admission letter, degree evaluation, or unofficial transcript in myUSF. Or email appservices@usfca.edu. Q26: How do I check prerequisites for a course? A26: Click the course title when browsing classes, then click Prerequisites. Q27: What if I need help registering? A27: Call 415-422-4932 on April 23 from 10 a.m. to 4 p.m. or contact your faculty adviser or CASA at 415-422-5050. Q28: What do the abbreviations under 'Days and Times' mean? A28: MWF = Monday, Wednesday, Friday; R = Thursday; TR = Tuesday and Thursday; S = Saturday. Q29: What does SR stand for? A29: SR = Student Restriction. You can't register until your registration window opens. Q30: Can you see course descriptions before registration opens? A30: Yes, click the course title to see its description. Q31: How quickly do classes usually fill up? A31: Depends, but first-years will always have options if flexible. Q32: Is the April 23rd registration only for the first semester? A32: Yes. Spring semester registration is in November. Q33: When do classes start? A33: Fall 2025 classes begin Tuesday, August 19, 2025. Q34: Why are classes showing up as full already? A34: Continuing students have already registered. Q35: Can I change classes later? A35: Yes, all summer. But courses on your schedule by June 30 will appear on your tuition bill. Q36: Is a practicum only required for Spanish? A36: Several languages require practicums. Check if the course has a co-requisite. Q37: What is the website to register for classes? A37: Log into myUSF and use Banner Self-Service Student under Top Apps. Q38: What is the registration deadline? A38: Register by June 30 to ensure your tuition bill is accurate. You can still add/drop until classes start.",
    };

    const errorHandling = {
      role: "system",
      content: "If you are unsure about an answer, politely inform the user and suggest they contact the registrar's office, their CASA coach, or major advisor for further assistance.",
    };

    // Combine system prompt, knowledge base, and user messages
    const fullMessages = [systemPrompt, userContext, knowledgeBase, errorHandling, faq, ...messages];

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