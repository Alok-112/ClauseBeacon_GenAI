'use server';

/**
 * @fileOverview Extracts text from a document provided as a data URI.
 *
 * - extractTextFromDocument - A function that extracts text from a document.
 * - ExtractTextFromDocumentInput - The input type for the extractTextFromDocument function.
 * - ExtractTextFromDocumentOutput - The return type for the extractTextFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document to extract text from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromDocumentInput = z.infer<
  typeof ExtractTextFromDocumentInputSchema
>;

const ExtractTextFromDocumentOutputSchema = z.object({
  extractedText: z.string().describe('The extracted text from the document. If no text can be extracted, this should be empty.'),
});
export type ExtractTextFromDocumentOutput = z.infer<
  typeof ExtractTextFromDocumentOutputSchema
>;

export async function extractTextFromDocument(
  input: ExtractTextFromDocumentInput
): Promise<ExtractTextFromDocumentOutput> {
  return extractTextFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTextFromDocumentPrompt',
  input: {schema: ExtractTextFromDocumentInputSchema},
  output: {schema: ExtractTextFromDocumentOutputSchema},
  prompt: `You are an expert Optical Character Recognition (OCR) engine. Your task is to extract all text content from the provided document.

- Analyze the document carefully.
- Extract every piece of readable text.
- If the document is a legal contract, make a best effort to preserve the original formatting, including paragraphs, spacing, and structure.
- If the document is of poor quality, try to decipher the text as accurately as possible.
- If the document contains no readable text at all (e.g., it's a blank image or completely unintelligible), return an empty string for the extractedText field.

Document:
{{media url=documentDataUri}}`,
});

const extractTextFromDocumentFlow = ai.defineFlow(
  {
    name: 'extractTextFromDocumentFlow',
    inputSchema: ExtractTextFromDocumentInputSchema,
    outputSchema: ExtractTextFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    if (!output || typeof output.extractedText !== 'string' || !output.extractedText.trim()) {
        throw new Error("The AI model could not find any readable text in the document. It might be blank, corrupted, or too blurry.");
    }
    
    return output;
  }
);
