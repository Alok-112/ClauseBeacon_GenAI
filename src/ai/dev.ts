'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/explain-simplified-clause.ts';
import '@/ai/flows/translate-document.ts';
import '@/ai/flows/generate-actionable-checklist.ts';
import '@/ai/flows/summarize-legal-document.ts';
import '@/ai/flows/identify-risk-factors.ts';
import '@/ai/flows/generate-speech.ts';
import '@/ai/flows/extract-text-from-document.ts';
