import fs from 'fs';

const code = 
/**
 * Translates a complete Mindset (Personal or B2B) and explicitly wraps strings with SSML tags.
 */
export async function translateMindsetToSSML(
  content: Record<string, any>,
  targetLang: string
): Promise<MindsetTranslation> {
  const prompt = translateToSSMLPrompt(targetLang) + JSON.stringify(content, null, 2);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert translator and audio script engineer.' },
        { role: 'user', content: prompt }
      ],
      response_format: zodResponseFormat(MindsetTranslationSchema, 'mindset_translation'),
      temperature: 0.4,
    });

    const translated = completion.choices[0].message.content;
    if (!translated) throw new Error('No SSML translation generated');

    return JSON.parse(translated) as MindsetTranslation;
  } catch (error) {
    console.error(\Error translating SSML content to \:\, error);
    throw error;
  }
}
;
fs.appendFileSync('src/lib/content-engine/openai.ts', code);
