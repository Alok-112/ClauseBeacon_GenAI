'use server';

/**
 * @fileOverview Answers a user's question based on the content of a legal document.
 *
 * - answerDocumentQuestion - A function that takes a document and a question and returns an answer.
 * - AnswerDocumentQuestionInput - The input type for the answerDocumentQuestion function.
 * - AnswerDocumentQuestionOutput - The return type for the answerDocumentQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerDocumentQuestionInputSchema = z.object({
  documentText: z
    .string()
    .describe('The complete text of the legal document.'),
  question: z.string().describe('The user\'s question about the document.'),
});
export type AnswerDocumentQuestionInput = z.infer<
  typeof AnswerDocumentQuestionInputSchema
>;

const AnswerDocumentQuestionOutputSchema = z.object({
  answer: z
    .string()
    .describe('The answer to the user\'s question based on the document.'),
});
export type AnswerDocumentQuestionOutput = z.infer<
  typeof AnswerDocumentQuestionOutputSchema
>;

export async function answerDocumentQuestion(
  input: AnswerDocumentQuestionInput
): Promise<AnswerDocumentQuestionOutput> {
  return answerDocumentQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerDocumentQuestionPrompt',
  input: {schema: AnswerDocumentQuestionInputSchema},
  output: {schema: AnswerDocumentQuestionOutputSchema},
  prompt: `You are an expert legal assistant. You will be given a legal document and a user's question about that document. Your task is to answer the question based *only* on the information provided in the document. If the answer cannot be found in the document, state that clearly.

Legal Document:
---
{{documentText}}
---

User's Question:
"{{question}}"

Answer:`,
});

const answerDocumentQuestionFlow = ai.defineFlow(
  {
    name: 'answerDocumentQuestionFlow',
    inputSchema: AnswerDocumentQuestionInputSchema,
    outputSchema: AnswerDocumentQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
