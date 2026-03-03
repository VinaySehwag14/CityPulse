import { GoogleGenAI } from '@google/genai';
import env from '../../config/env';

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

/**
 * Automatically generates category tags for an event based on its title and description.
 */
export async function generateTags(title: string, description: string | null): Promise<string[]> {
    if (!env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY is not set. Skipping tag generation.');
        return [];
    }

    const prompt = `
You are an event categorization assistant for the app CityPulse.
Given the following event title and description, generate exactly 3 highly relevant, broad category tags (e.g. #Music, #Technology, #Outdoors, #Food, #Networking, #Fitness).
Only output the tags, separated by commas, with NO other text. Each tag MUST start with a hashtag (#).

Title: ${title}
Description: ${description || 'No description provided'}
    `.trim();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text;
        if (!text) return [];

        // Parse "#Music, #Tech" -> ["Music", "Tech"] (removing the hashtag for clean DB storage, or we can keep it)
        // Let's keep the hashtags as it looks nice on UI, or maybe strip them so UI can render them consistently.
        // Actually, F17 specifies e.g., `#Music`, but usually we just store the word and UI adds the styling.
        // Let's store them without hashtags for cleaner data.
        const rawTags = text.split(',').map(t => t.trim());
        const cleanedTags = rawTags.map(t => t.replace(/^#/, '')).filter(t => t.length > 0);
        return cleanedTags.slice(0, 3);
    } catch (err) {
        console.error('[AI Service] Error generating tags:', err);
        return [];
    }
}
