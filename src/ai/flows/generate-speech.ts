'use server';
/**
 * @fileOverview Converts text to speech.
 *
 * - generateSpeech - A function that takes text and returns audio.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

export async function generateSpeech(input: string): Promise<{ media: string }> {
  return generateSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const detectLanguagePrompt = ai.definePrompt(
    {
      name: 'detectLanguagePrompt',
      input: { schema: z.string() },
      output: { schema: z.object({ lang: z.string().describe("The ISO 639-1 code for the detected language (e.g., 'en', 'hi', 'es'). Default to 'en' if unsure.") }) },
      prompt: `Detect the primary language of the following text and return its ISO 639-1 code. For Hinglish, use 'hi'.

Text:
{{input}}`,
    }
);

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: z.string(),
    outputSchema: z.object({ media: z.string() }),
  },
  async (query) => {

    if (!query.trim()) {
        throw new Error("Input text cannot be empty.");
    }
    
    // 1. Detect Language
    const { output } = await detectLanguagePrompt(query);
    const lang = output?.lang?.toLowerCase() || 'en';

    // 2. Select Voice based on language
    // Note: These are example voices. Refer to Google's documentation for a full list.
    // 'hi' for Hindi/Hinglish, 'en' for English.
    const voice = lang.startsWith('hi') ? 'hi-IN-Wavenet-D' : 'Algenib';

    // 3. Generate Speech
    try {
        const { media } = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-tts'),
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voice },
                },
                },
            },
            prompt: query,
        });

        if (!media || !media.url) {
            throw new Error('No audio media was returned from the TTS service.');
        }

        const audioBuffer = Buffer.from(
            media.url.substring(media.url.indexOf(',') + 1),
            'base64'
        );
        
        if (audioBuffer.length === 0) {
            throw new Error('Received empty audio buffer.');
        }

        return {
            media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
        };

    } catch (e) {
        console.error("Error in TTS Generation:", e);
        const errorMessage = e instanceof Error ? e.message : 'Unknown error during TTS generation.';
        // It's better to throw and let the action handler catch it.
        throw new Error(`Failed to generate audio for language '${lang}' with voice '${voice}'. Reason: ${errorMessage}`);
    }
  }
);
