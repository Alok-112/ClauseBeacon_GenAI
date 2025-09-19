'use server';

/**
 * @fileOverview Summarizes a legal document, highlighting key points.
 *
 * - summarizeLegalDocument - A function that summarizes a legal document.
 * - SummarizeLegalDocumentInput - The input type for the summarizeLegalDocument function.
 * - SummarizeLegalDocumentOutput - The return type for the summarizeLegalDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLegalDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the legal document to summarize.'),
});
export type SummarizeLegalDocumentInput = z.infer<
  typeof SummarizeLegalDocumentInputSchema
>;

const SummarizeLegalDocumentOutputSchema = z.object({
  summary: z.string().describe('A simplified summary of the legal document, using headings and bullet points.'),
});
export type SummarizeLegalDocumentOutput = z.infer<
  typeof SummarizeLegalDocumentOutputSchema
>;

export async function summarizeLegalDocument(
  input: SummarizeLegalDocumentInput
): Promise<SummarizeLegalDocumentOutput> {
  return summarizeLegalDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLegalDocumentPrompt',
  input: {schema: SummarizeLegalDocumentInputSchema},
  output: {schema: SummarizeLegalDocumentOutputSchema},
  prompt: `Summarize the following legal document. Your summary should be easy for a layperson to understand.
Structure your response with clear headings (using ## for titles) and bullet points (using -) to highlight the key points.

Document:
{{{documentText}}}`,
});

const summarizeLegalDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeLegalDocumentFlow',
    inputSchema: SummarizeLegalDocumentInputSchema,
    outputSchema: SummarizeLegalDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
