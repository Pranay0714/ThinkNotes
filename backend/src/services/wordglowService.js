import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export async function enhanceText(text, mode = "improve") {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  let modeInstruction = "";

  switch (mode) {
    case "grammar":
      modeInstruction = `
Focus primarily on:
- grammar correction
- spelling correction
- punctuation
- correct sentence structure

Do not unnecessarily rewrite the writing style.
Preserve the original tone and meaning.
`;
      break;

    case "professional":
      modeInstruction = `
Rewrite the note in a professional and polished tone.

Focus on:
- professional vocabulary
- formal communication
- clear sentence structure
- polished writing

Preserve the original meaning.
`;
      break;

    case "concise":
      modeInstruction = `
Make the note shorter and more concise.

Focus on:
- removing unnecessary words
- removing repetition
- keeping important information
- making sentences direct

Do not remove important meaning.
`;
      break;

    case "clarity":
      modeInstruction = `
Improve the clarity and readability of the note.

Focus on:
- easy-to-understand sentences
- logical flow
- removing ambiguity
- improving readability

Preserve the original meaning.
`;
      break;

    default:
      modeInstruction = `
Improve the overall quality of the note.

Focus on:
- grammar
- spelling
- clarity
- readability
- sentence structure

Do not change the meaning of the note.
`;
  }

  const prompt = `
You are WordGlow, an AI writing assistant.

Your task is to improve the following note according to the selected improvement mode.

Selected Mode: ${mode}

${modeInstruction}

Return a JSON object with exactly this structure:

{
  "improvedText": "string",
  "suggestions": [
    {
      "type": "string",
      "original": "string",
      "replacement": "string",
      "explanation": "string"
    }
  ]
}

Rules:
- Return ONLY valid JSON.
- Do not use markdown.
- Do not add explanations outside JSON.
- Preserve the original meaning unless the selected mode explicitly requires rewriting style.
- If no specific suggestions are necessary, return an empty suggestions array.

Note:
${text}
`;

  const result = await model.generateContent(prompt);

  const responseText = result.response.text();

  return JSON.parse(responseText);
}