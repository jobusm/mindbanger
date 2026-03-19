// Ensure environment variables are loaded if using tsx outside next
import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local' });

import { generateDailyContent } from '../src/lib/content-engine/openai';

async function main() {
  const dateStr = '2026-03-20'; // A Friday in the future

  console.log(`Generating content for ${dateStr}...`);
  try {
    const content = await generateDailyContent(dateStr, 'en');
    console.log('--- Generated Content (EN) ---');
    console.log(JSON.stringify(content, null, 2));

    // Could test translation here too
    // const skContent = await translateDailyContent(content, 'sk');
    // console.log('--- Translated (SK) ---');
    // console.log(skContent);

  } catch (err) {
    console.error('Failed to generate content:', err);
  }
}

main();
