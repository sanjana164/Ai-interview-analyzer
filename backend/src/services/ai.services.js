const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

// ✅ Plain object schema — no zodToJsonSchema needed
const geminiSchema = {
    type: "object",
    properties: {
        title: { type: "string" },
        matchScore: { type: "number" },
        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" },
                },
                required: ["question", "intention", "answer"],
            },
        },
        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" },
                },
                required: ["question", "intention", "answer"],
            },
        },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] },
                },
                required: ["skill", "severity"],
            },
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } },
                },
                required: ["day", "focus", "tasks"],
            },
        },
    },
    required: [
        "title",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
    ],
};

// ✅ Zod schema kept for validation after parsing
const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100),
    technicalQuestions: z
        .array(
            z.object({
                question: z.string(),
                intention: z.string(),
                answer: z.string(),
            })
        )
        .max(7),
    behavioralQuestions: z
        .array(
            z.object({
                question: z.string(),
                intention: z.string(),
                answer: z.string(),
            })
        )
        .max(5),
    skillGaps: z
        .array(
            z.object({
                skill: z.string(),
                severity: z.enum(["low", "medium", "high"]),
            })
        )
        .max(6),
    preparationPlan: z
        .array(
            z.object({
                day: z.number(),
                focus: z.string(),
                tasks: z.array(z.string()).max(4),
            })
        )
        .max(7),
    title: z.string(),
});

async function invokeGeminiAi(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error(error);
        throw new Error("Gemini API temporarily unavailable. Please try again later.");
    }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate a CONCISE interview report. Be brief in all answers and descriptions.
Keep each answer field to 3-5 bullet points maximum. Do not elaborate unnecessarily.
Return only the JSON object — no extra text.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}`;

    let responseText;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: geminiSchema,  // ✅ plain object, not zod-converted
                generationConfig: {
                    maxOutputTokens: 8192,
                },
            },
        });

        responseText = response.text;

        const parsed = JSON.parse(responseText);

        // ✅ Validate with Zod after parsing
        return interviewReportSchema.parse(parsed);

    } catch (err) {
        console.error("JSON parse or validation failed:", err.message);
        console.error("Response length:", responseText?.length);
        console.error("Last 300 chars:", responseText?.slice(-300));
        throw new Error(`Failed to parse Gemini response: ${err.message}`);
    }
}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}


async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}
module.exports = { generateInterviewReport , generateResumePdf};