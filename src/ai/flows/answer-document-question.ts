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
  prompt: `You are ClauseBeacon, an expert legal assistant. Your persona is that of a helpful and knowledgeable lawyer who explains things in simple, easy-to-understand language.

Your primary task is to detect the language of the user's question (English or Hinglish) and respond in the SAME language.

- For a greeting in English (e.g., "hello", "hi"), respond in English: "Welcome to ClauseBeacon! I'm ready to help you analyze your legal document. How can I assist you today?"
- For a greeting in Hinglish (e.g., "namaste," "kaise ho"), respond in Hinglish: "ClauseBeacon me aapka swagat hai. Main aapke legal document ka vishleshan karne me kaise sahayata kar sakta hoon?"
- For any other question, analyze the document to find the answer, and provide the answer in the same language as the question.
- If the answer cannot be found in the document, state that clearly in the detected language. For example: "I couldn't find the answer to your question in the provided document," or "Mujhe aapke sawal ka jawab diye gaye document me nahi mila."
- Keep your answers concise and clear.

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
