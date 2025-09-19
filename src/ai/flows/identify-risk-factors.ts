'use server';

/**
 * @fileOverview Identifies potential risk factors and onerous clauses within a legal document.
 *
 * - identifyRiskFactors - A function that identifies risk factors in a document.
 * - IdentifyRiskFactorsInput - The input type for the identifyRiskFactors function.
 * - IdentifyRiskFactorsOutput - The return type for the identifyRiskFactors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyRiskFactorsInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document.'),
});
export type IdentifyRiskFactorsInput = z.infer<typeof IdentifyRiskFactorsInputSchema>;

const IdentifyRiskFactorsOutputSchema = z.object({
  riskFactors: z
    .array(z.string())
    .describe('A list of potential risk factors and onerous clauses identified in the document.'),
});
export type IdentifyRiskFactorsOutput = z.infer<typeof IdentifyRiskFactorsOutputSchema>;

export async function identifyRiskFactors(
  input: IdentifyRiskFactorsInput
): Promise<IdentifyRiskFactorsOutput> {
  return identifyRiskFactorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyRiskFactorsPrompt',
  input: {schema: IdentifyRiskFactorsInputSchema},
  output: {schema: IdentifyRiskFactorsOutputSchema},
  prompt: `You are an AI legal assistant tasked with identifying potential risk factors and onerous clauses in legal documents.
  Analyze the following document and identify any clauses or factors that could be disadvantageous or pose a risk to the user.
  Provide a list of these risk factors and onerous clauses.

  Document:
  {{documentText}}`,
});

const identifyRiskFactorsFlow = ai.defineFlow(
  {
    name: 'identifyRiskFactorsFlow',
    inputSchema: IdentifyRiskFactorsInputSchema,
    outputSchema: IdentifyRiskFactorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
