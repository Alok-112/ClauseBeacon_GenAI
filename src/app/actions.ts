'use server';

import { generateActionableChecklist } from '@/ai/flows/generate-actionable-checklist';
import { identifyRiskFactors } from '@/ai/flows/identify-risk-factors';
import { summarizeLegalDocument } from '@/ai/flows/summarize-legal-document';
import { explainSimplifiedClause } from '@/ai/flows/explain-simplified-clause';
import { translateDocument } from '@/ai/flows/translate-document';
import type { AnalysisResult } from '@/lib/types';

export async function analyzeDocumentAction(documentText: string): Promise<AnalysisResult> {
  if (!documentText.trim()) {
    throw new Error('Document text cannot be empty.');
  }

  try {
    const [summaryResult, riskFactorsResult, checklistResult] = await Promise.all([
      summarizeLegalDocument({ documentText }),
      identifyRiskFactors({ documentText }),
      generateActionableChecklist({ documentText }),
    ]);

    return {
      summary: summaryResult.summary,
      riskFactors: riskFactorsResult.riskFactors,
      checklist: checklistResult.checklist,
    };
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw new Error('Failed to analyze the document. Please try again.');
  }
}

export async function explainClauseAction(documentText: string, clause: string): Promise<string> {
    if (!documentText.trim() || !clause.trim()) {
        throw new Error('Document text and clause cannot be empty.');
    }
    try {
        const result = await explainSimplifiedClause({ documentText, clause });
        return result.simplifiedExplanation;
    } catch (error) {
        console.error('Error explaining clause:', error);
        throw new Error('Failed to explain the clause. Please try again.');
    }
}

export async function translateAnalysisAction(analysis: AnalysisResult, targetLanguage: string): Promise<AnalysisResult> {
    if (!analysis || !targetLanguage) {
        throw new Error('Analysis and target language are required.');
    }
    try {
        const translateText = async (text: string) => {
            if (!text) return "";
            const result = await translateDocument({ documentText: text, targetLanguage });
            return result.translatedText;
        };

        const [translatedSummary, translatedRisks, translatedChecklist] = await Promise.all([
            translateText(analysis.summary),
            Promise.all(analysis.riskFactors.map(risk => translateText(risk))),
            translateText(analysis.checklist),
        ]);

        return {
            summary: translatedSummary,
            riskFactors: translatedRisks,
            checklist: translatedChecklist,
        };
    } catch (error) {
        console.error('Error translating analysis:', error);
        throw new Error('Failed to translate the analysis. Please try again.');
    }
}
