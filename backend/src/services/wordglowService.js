import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export async function enhanceText(text) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = `
You are WordGlow, an AI writing assistant.

Analyze the following note and return a JSON object with:

1. improvedText
2. suggestions

For every suggestion include:
- type
- original
- replacement
- explanation

Focus on:
- grammar
- spelling
- clarity
- readability
- sentence structure

Do not change the meaning of the note.

Return ONLY valid JSON.

Note:
${text}
`;

  const result = await model.generateContent(prompt);

  const responseText = result.response.text();

  return JSON.parse(responseText);
}