'use server';
/**
 * @fileOverview Generates an actionable checklist based on a legal document.
 *
 * - generateActionableChecklist - A function that generates the checklist.
 * - GenerateActionableChecklistInput - The input type for the generateActionableChecklist function.
 * - GenerateActionableChecklistOutput - The return type for the generateActionableChecklist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateActionableChecklistInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document.'),
});

export type GenerateActionableChecklistInput = z.infer<
  typeof GenerateActionableChecklistInputSchema
>;

const GenerateActionableChecklistOutputSchema = z.object({
  checklist: z.string().describe('A checklist of actionable items in markdown format. Each item must be a separate line starting with "- ".'),
});

export type GenerateActionableChecklistOutput = z.infer<
  typeof GenerateActionableChecklistOutputSchema
>;

export async function generateActionableChecklist(
  input: GenerateActionableChecklistInput
): Promise<GenerateActionableChecklistOutput> {
  return generateActionableChecklistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActionableChecklistPrompt',
  input: {schema: GenerateActionableChecklistInputSchema},
  output: {schema: GenerateActionableChecklistOutputSchema},
  prompt: `You are an AI assistant designed to generate actionable checklists from legal documents.

  Based on the following legal document text, create a checklist of actions that the user should consider.
  
  Format the output as a markdown list. Each item must be on a new line and start with "- ". For example:
  - Review the termination clause carefully.
  - Clarify the payment schedule with the other party.
  
  Do not include any other text, headings, or introductory sentences. Only output the markdown list.

  Document Text:
  {{documentText}}

  Checklist:`,
});

const generateActionableChecklistFlow = ai.defineFlow(
  {
    name: 'generateActionableChecklistFlow',
    inputSchema: GenerateActionableChecklistInputSchema,
    outputSchema: GenerateActionableChecklistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
