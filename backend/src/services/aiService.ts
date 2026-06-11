import { GoogleGenerativeAI } from '@google/generative-ai';

const domains = [
  'Mycology (The study of fungal networks)',
  'Orbital Mechanics',
  'Deep Sea Bioluminescence',
  '19th Century Gothic Architecture',
  'Quantum Entanglement',
  'Beekeeping and Hive Intelligence',
  'Japanese Wood Joinery',
  'Volcanology',
  'Renaissance Fresco Restoration',
  'Cybernetics and Feedback Loops',
  'The Silk Road Trade Logistics',
  'Glaciology and Ice Core Sampling'
];

export const generateAnalogy = async (problem: string) => {
  const apiKey = process.env.AI_API_KEY;
  const provider = process.env.LLM_PROVIDER || 'GOOGLE_GEMINI';

  const randomDomain = domains[Math.floor(Math.random() * domains.length)];

  if (!apiKey || apiKey === 'your_api_key_here') {
    // Return a beautiful mock response if no API key is set, 
    // to ensure the product "works" out of the box for testing.
    return {
      domain: randomDomain,
      analogy: `[MOCK MODE: API Key Not Found] In the realm of ${randomDomain}, your challenge with "${problem}" is much like how a system manages equilibrium under pressure. Consider how the structure redistributes load to maintain integrity. Perhaps the solution isn't to fight the tension, but to integrate it into the design.`,
      actionableInsight: "Look for the natural 'load-bearing' elements of your current structure and reinforce them instead of adding new layers."
    };
  }

  if (provider === 'GOOGLE_GEMINI') {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are the ParadigmDrift Serendipity Engine. 
      The user is stuck on this problem: "${problem}".
      
      Your task is to draw a deep, poetic, and highly relevant analogy from the field of ${randomDomain}.
      
      Requirements:
      1. Do NOT give a technical answer to the problem.
      2. Explain the concept from ${randomDomain} first.
      3. Connect it to the user's problem via an "Oblique Strategy".
      4. Provide one "Actionable Insight" that translates the metaphor back to reality.

      Format your response as a JSON object:
      {
        "domain": "${randomDomain}",
        "analogy": "...",
        "actionableInsight": "..."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting from LLM response
    const jsonString = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  }

  throw new Error(`Provider ${provider} not implemented yet.`);
};
