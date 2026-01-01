
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { transcript, youtube_id, title } = body;

        // Accept direct transcript from request body
        if (!transcript || transcript.trim().length < 100) {
            return NextResponse.json({
                rejected: true,
                is_suitable: false,
                quality_score: 0,
                reason: 'Transcript is too short or missing (less than 100 characters)'
            }, { status: 200 });
        }

        const transcriptText = transcript;

        // Prepare the Chief Editor Prompt with Quality Assessment
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        You are the **Chief Editor and Spiritual Curator** of "Saileela Rahasya".
        Your mission is to transform raw spoken transcripts of spiritual talks into timeless, beautifully structured written wisdom (Leelas).

        **Input Transcript**:
        ${transcriptText}

        **STEP 1: Quality Assessment (CRITICAL)**
        Before generating any content, you MUST first assess whether this transcript is suitable for a Leela article.
        
        **Criteria for REJECTION** (set is_suitable: false):
        - The transcript is mostly gibberish, auto-generated errors, or incoherent
        - No clear spiritual teaching, story, or message can be extracted
        - The content is purely promotional, off-topic, or unrelated to Sai Baba / spirituality
        - The transcript is too short or fragmented to derive meaningful content
        - The content is just greetings, housekeeping, or administrative talk without substance
        
        **Criteria for APPROVAL** (set is_suitable: true):
        - Contains a clear spiritual teaching, parable, or story
        - Has identifiable lessons, wisdom, or guidance
        - References Sai Baba, scriptures, saints, or spiritual concepts
        - Has enough substance to create a meaningful article (min ~500 words of content)

        **STEP 2: Generate Content (Only if is_suitable: true)**

        **Anti-Hallucination & Grounding**:
        - STRICTLY base your response ONLY on the provided transcript.
        - If a specific detail (e.g., a name, a place, a scripture) is not in the text, DO NOT invent it.
        - If the transcript is unclear, summarize the essence without adding external fiction.

        **JSON Response Structure**:

        {
            "is_suitable": boolean,       // TRUE if transcript is good for article, FALSE otherwise
            "quality_score": number,      // 1-10 rating of transcript quality
            "rejection_reason": string,   // If is_suitable is false, explain why (null if suitable)
            "suggested_title": string,    // A compelling, descriptive title IN ENGLISH (even if transcript is Hindi)
            
            // The following fields should ONLY be populated if is_suitable is TRUE:
            "story": string,              // The Leela narrative (or null if rejected)
            "doubt": string,              // The conflict/doubt section (or null if rejected)
            "revelation": string,         // The revelation/teaching (or null if rejected)
            "scriptural_refs": string,    // Scripture references (or null if none/rejected)
            "keywords": string[],         // List of 3-5 keywords for SEO (or null if rejected)
            "social_tags": string[]       // List of 3-5 hashtags (e.g., #SaiBaba) (or null if rejected)
        }

        **Content Formatting Guidelines** (only if is_suitable: true):

        1.  **story**: "Leela"
            - Write a captivating, 3rd-person narrative.
            - Use *italics* for inner thoughts, feelings, or emphasis to make it immersive.
            - **Goal**: Transport the reader to the scene.

        2.  **doubt**: "Conflict"
            - **DO NOT** start with "❓ Doubt" or any label. The UI adds the header.
            - Provide a clear, one-sentence summary of the skepticism or intellectual question.
            - Follow with a brief context.
            - Use **bold** for key philosophical terms (e.g., **Nirguna**, **Saguna**).

        3.  **revelation**: "Revelation"
            - **DO NOT** start with "💡 Revelation" or any label.
            - This is the core teaching. Break it down logically.
            - Use **Bullet Points** for distinct logical steps or arguments.
            - Use > blockquotes for any direct words/dialogue from Saibaba or God. This is CRITICAL for impact.
            - Example:
              > "Why do you fear when I am here?"

        4.  **scriptural_refs**: "References"
            - Start with: "📖"
            - List specific references (e.g., "Sai Satcharitra Chapter 11").
            - If none, return null.

        **Tone**:
        - Devotional yet analytical.
        - Clear, accessible, but profound.
        - Avoid generic fluff.
        `;

        // Generate
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const content = JSON.parse(responseText);

        // If content was rejected, return with a specific status
        if (content.is_suitable === false) {
            return NextResponse.json({
                rejected: true,
                quality_score: content.quality_score,
                reason: content.rejection_reason || 'Transcript does not contain suitable content for a Leela article',
                ...content
            }, { status: 200 }); // 200 OK but with rejection flag
        }

        return NextResponse.json(content);

    } catch (error: any) {
        console.error('Agent Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
