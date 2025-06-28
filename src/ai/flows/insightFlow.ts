'use server';
/**
 * @fileOverview An AI agent that provides insights on poultry flock data.
 * - getInsight: A function that analyzes flock data and returns advice.
 */
import { z } from 'zod';
import { ai } from '../genkit';
import type { FlockData } from '@/lib/types';

// The un-exported flow that contains the core logic.
const insightFlow = ai.defineFlow(
  {
    name: 'insightFlow',
    inputSchema: z.any(), // Accepts the full FlockData object
    outputSchema: z.string(),
  },
  async (flockData: FlockData) => {
    // Remove detailed logs to fit within token limits and focus on aggregates
    const summaryData = {
      ...flockData,
      eggLogs: `Total ${flockData.eggLogs.length} days of egg logs.`,
      mortalityLogs: `Total ${flockData.mortalityLogs.length} mortality events.`,
      feedLogs: `Total ${flockData.feedLogs.length} feed logs.`,
      sales: `Total ${flockData.sales.length} sale records.`,
      expenses: `Total ${flockData.expenses.length} expense records.`,
    };

    const prompt = `
      You are an expert poultry farm advisor.
      Analyze the following summary of a poultry flock's data.
      Based on this data, provide:
      1. A concise summary (2-3 sentences) of the flock's overall performance, mentioning key aspects like profit, egg production, and mortality.
      2. One actionable, data-driven piece of advice to help the owner improve their operation.

      Keep your entire response under 75 words. Be encouraging and clear.

      Data:
      \`\`\`json
      ${JSON.stringify(summaryData, null, 2)}
      \`\`\`
    `;

    try {
      const llmResponse = await ai.generate({
        prompt,
        config: {
            temperature: 0.5,
        }
      });
      return llmResponse.text;
    } catch (e) {
      console.error("Error generating AI insight:", e);
      return "There was an issue analyzing the flock data. Please try again later."
    }
  }
);

// The exported wrapper function that the application will call.
export async function getInsight(flockData: FlockData): Promise<string> {
  return insightFlow(flockData);
}
