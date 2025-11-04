import { GoogleGenAI, Type } from "@google/genai";
import { LCIEntry, ImpactData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    impacts: {
      type: Type.ARRAY,
      description: "List of environmental impacts for each inventory item.",
      items: {
        type: Type.OBJECT,
        properties: {
          material: { type: Type.STRING, description: "Name of the material or process." },
          stage: { type: Type.STRING, description: "The life cycle stage." },
          co2eq: { type: Type.NUMBER, description: "Calculated carbon footprint in kg CO2 equivalent." },
        },
        required: ["material", "stage", "co2eq"],
      },
    },
    recommendations: {
      type: Type.ARRAY,
      description: "Actionable recommendations to reduce environmental impact.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ["impacts", "recommendations"],
};

export async function analyzeLCAData(entries: LCIEntry[]): Promise<{ impacts: ImpactData[], recommendations: string[] }> {
    const systemInstruction = `
        You are a sophisticated AI Life Cycle Assessment (LCA) engine for an educational dashboard.
        Your purpose is to help students understand environmental impacts by analyzing their data and providing clear, actionable insights.
        You must always return a valid JSON object that strictly adheres to the provided schema.
    `;

    const prompt = `
        Given the following list of Life Cycle Inventory (LCI) entries for a product, perform the following tasks:
        1. For each entry, estimate the Carbon Footprint in kg CO2eq. Use standard, recognized emission factors. If a specific factor is not available, use a reasonable, educated estimate for a similar material or process.
        2. Provide 3 to 5 actionable, specific, and creative recommendations for reducing the overall environmental impact. The recommendations should be easy for students to understand and inspiring.

        Here is the LCI data:
        ${JSON.stringify(entries.map(({ id, ...rest }) => rest), null, 2)}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.5,
        },
    });

    try {
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        if (!parsedJson.impacts || !Array.isArray(parsedJson.impacts) || !parsedJson.recommendations || !Array.isArray(parsedJson.recommendations)) {
            throw new Error("Invalid JSON structure from AI.");
        }
        
        return parsedJson as { impacts: ImpactData[], recommendations: string[] };
    } catch (error) {
        console.error("Failed to parse AI response:", response.text, error);
        throw new Error("AI response was not valid JSON.");
    }
}