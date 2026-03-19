// Definícia systémových promptov pre generovanie obsahu
// Tieto prompty budú použité pre LLM (GPT-4o/Claude 3.5 Sonnet)

export interface PromptTemplate {
  system: string;
  user: (date: string, context?: string, themeHint?: string) => string;
}

export const generateThemePrompt: PromptTemplate = {
  system: `You are an expert mindset coach and philosopher. Your task is to generate a daily theme for a self-improvement app called Mindbanger.
Return ONLY a valid JSON object with the following structure:
{
  "theme": "Short punchy theme (max 5 words)",
  "focus": "A 2-3 sentence explanation of why this theme matters today.",
  "affirmation": "A powerful, first-person present tense affirmation related to the theme.",
  "script": "A 45-60 second spoken word script expanding on the theme. Conversational, direct, inspiring tone. Use simple language."
}
Language: {language}
JSON format is mandatory.`,
  user: (date, context, themeHint) => `Generate content for date: ${date}.
${context ? context : ''}
${themeHint ? `Theme hint: ${themeHint}` : 'Choose a relevant theme for this day based on the context provided.'}`
};

export const translatePrompt = (targetLang: string): string => `
You are a professional translator and cultural adapter.
Translate the following JSON content into ${targetLang === 'sk' ? 'Slovak' : targetLang === 'cs' ? 'Czech' : 'English'}.
Maintain the tone: direct, masculine, inspiring, stoic.
Do not translate the keys of the JSON, only the values.
Input JSON:
`;
