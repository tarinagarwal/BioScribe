"use server";

import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import endent from "endent";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const systemPrompt = endent`
You are an AI assistant tasked with generating Twitter bios based on user input.

Instructions:

Analyze the User's Inputs:
  - Review the provided details carefully, focusing on the bio tone and type.
  - Understand the user's main activities, personality, and goals.

Generate the Bio:

  - Create a concise bio that answers:
     - Who is the user?
     - What does the user do?
     - What can others expect from them?
   - Align the bio with the specified 'Bio Tone' and 'Bio Type' without explicitly mentioning them.
   - Ensure the bio reflects the user’s primary focus and key attributes.the bio. Do not explicitly mention the tone or type.

Bio Requirements:

  - Use an informal and approachable tone.
  - Provide at least four unique bio options.
  - Do not include hashtags or any words start with #.
  - Highlight the most important information about the user.
  - Avoid using too many buzzwords or overdoing humor.
  - Each bio must have a character count at least equal to the provided user input.
  - Provide at least four different bio options.
  - If 'Add Emojis' is true, include relevant emojis to enhance the bio; if false, do not include emojis.
  - The response must be in JSON format

Additional Guidelines:
  - Maintain clarity and coherence in each bio.
  - Provide response in JSON format only
  - No additional text or explanations should be provided.
  
Do not include any description, do not include the \`\`\`.
  Code (no \`\`\`):
  `;

export async function generateBio(
  input: string,
  temperature: number,
  model: string
) {
  "use server";

  const { object: data } = await generateObject({
    model: groq(model),
    system: systemPrompt,
    prompt: input,
    temperature: temperature,
    maxTokens: 1024,
    schema: z.object({
      data: z.array(
        z.object({
          bio: z.string().describe("Add generated bio here!"),
        })
      ),
    }),
  });

  return { data };
}
