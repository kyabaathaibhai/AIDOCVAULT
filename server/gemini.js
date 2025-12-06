import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY;
let client = null;

if (apiKey) {
  client = new GoogleGenAI({ apiKey });
} else {
  console.warn("WARNING: API_KEY is missing. AI features will not work.");
}

export async function processDocument(content) {
  if (!client) {
    throw new Error("Gemini API not initialized");
  }

  const modelId = "gemini-2.5-flash";

  const prompt = `
    You are an expert document assistant. 
    Analyze the following document content.
    1. Provide a concise summary (max 3-4 sentences).
    2. Convert the content into clean, well-structured Markdown. 
       - Fix formatting issues.
       - Use proper headers, lists, and emphasis.
       - Do not change the original meaning or remove critical information.
    
    Return the result as a JSON object.
  `;

  const response = await client.models.generateContent({
    model: modelId,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { text: `--- DOCUMENT START ---\n${content}\n--- DOCUMENT END ---` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A concise summary of the document." },
          markdown: { type: Type.STRING, description: "The cleaned markdown version of the document." }
        },
        required: ["summary", "markdown"]
      }
    }
  });

  const responseText = response.text;
  if (!responseText) throw new Error("No response from AI");

  return JSON.parse(responseText);
}

