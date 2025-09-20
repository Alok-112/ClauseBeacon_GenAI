'use server';

/**
 * @fileOverview Translates a legal document into a specified language.
 *
 * - translateDocument - A function that translates the legal document.
 * - TranslateDocumentInput - The input type for the translateDocument function.
 * - TranslateDocumentOutput - The return type for the translateDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateDocumentInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document to be translated.'),
  targetLanguage: z.string().describe('The target language for the translation (e.g., "Spanish", "French", "German").'),
});
export type TranslateDocumentInput = z.infer<typeof TranslateDocumentInputSchema>;

const TranslateDocumentOutputSchema = z.object({
  translatedText: z.string().describe('The translated text of the legal document in the target language.'),
});
export type TranslateDocumentOutput = z.infer<typeof TranslateDocumentOutputSchema>;

export async function translateDocument(input: TranslateDocumentInput): Promise<TranslateDocumentOutput> {
  return translateDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateDocumentPrompt',
  input: {schema: TranslateDocumentInputSchema},
  output: {schema: TranslateDocumentOutputSchema},
  prompt: `You are a professional translator specializing in legal documents and an expert in markdown formatting. Your task is to translate the following text into {{{targetLanguage}}}.

It is crucial that you preserve the original markdown formatting. Do not alter the structure of headings (e.g., '##'), bullet points (e.g., '*'), or bold text (e.g., '**'). The translated text must have the exact same markdown structure as the original.

Original Document:
{{{documentText}}}`,
});

const translateDocumentFlow = ai.defineFlow(
  {
    name: 'translateDocumentFlow',
    inputSchema: TranslateDocumentInputSchema,
    outputSchema: TranslateDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
