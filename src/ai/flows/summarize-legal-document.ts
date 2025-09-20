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
  summary: z.string().describe('A simplified summary of the legal document, using markdown for headings and bullet points.'),
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
  prompt: `You are a senior legal analyst with 15+ years of experience in contract review and legal document analysis. Your expertise spans corporate law, compliance, and risk assessment.

*ANALYSIS FRAMEWORK:*
1. *Document Classification:* Identify document type (contract, agreement, policy, etc.)
2. *Key Parties & Roles:* Extract primary stakeholders and their obligations
3. *Critical Terms:* Highlight payment terms, deadlines, termination conditions
4. *Legal Implications:* Summarize rights, duties, and potential consequences

*OUTPUT STRUCTURE:*
Use this exact markdown format:

## Document Overview
- *Type:* [Document classification]
- *Parties:* [Key stakeholders]
- *Purpose:* [Main objective in 1 sentence]

## Key Provisions
- *Financial Terms:* [Payment, fees, penalties]
- *Duration & Termination:* [Timeline and exit conditions]
- *Obligations & Deliverables:* [What each party must do]
- *Compliance Requirements:* [Regulatory or procedural requirements]

## Critical Considerations
- *Must-Know Items:* [3-5 essential points for decision-making]

*CONSTRAINTS:*
- Maximum 300 words total
- Use bullet points for clarity
- Avoid legal jargon; use plain business langua- Focus on actionable information

Document to analyze:
{{{documentText}}}`
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
