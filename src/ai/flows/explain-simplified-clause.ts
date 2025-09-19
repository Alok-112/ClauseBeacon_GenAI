'use server';

/**
 * @fileOverview Provides a simplified explanation of a specific clause within a legal document.
 *
 * - explainSimplifiedClause - A function that takes a document and a clause and returns a simplified explanation of the clause.
 * - ExplainSimplifiedClauseInput - The input type for the explainSimplifiedClause function.
 * - ExplainSimplifiedClauseOutput - The return type for the explainSimplifiedClause function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainSimplifiedClauseInputSchema = z.object({
  documentText: z
    .string()
    .describe('The complete text of the legal document.'),
  clause: z.string().describe('The specific clause to be explained.'),
});
export type ExplainSimplifiedClauseInput = z.infer<
  typeof ExplainSimplifiedClauseInputSchema
>;

const ExplainSimplifiedClauseOutputSchema = z.object({
  simplifiedExplanation: z
    .string()
    .describe('A simplified explanation of the clause.'),
});
export type ExplainSimplifiedClauseOutput = z.infer<
  typeof ExplainSimplifiedClauseOutputSchema
>;

export async function explainSimplifiedClause(
  input: ExplainSimplifiedClauseInput
): Promise<ExplainSimplifiedClauseOutput> {
  return explainSimplifiedClauseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSimplifiedClausePrompt',
  input: {schema: ExplainSimplifiedClauseInputSchema},
  output: {schema: ExplainSimplifiedClauseOutputSchema},
  prompt: `You are an expert legal professional, skilled at explaining complex legal jargon in simple terms.  You will receive a legal document and a specific clause from that document. Your task is to provide a simplified explanation of the clause, making it easy for a layperson to understand.

Legal Document:
{{documentText}}

Clause to Explain:
{{clause}}

Simplified Explanation:`,
});

const explainSimplifiedClauseFlow = ai.defineFlow(
  {
    name: 'explainSimplifiedClauseFlow',
    inputSchema: ExplainSimplifiedClauseInputSchema,
    outputSchema: ExplainSimplifiedClauseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
