import { translateMindsetToSSML } from './src/lib/content-engine/openai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
    const textContent = {
        theme: 'Hodnota',
        focus: 'Budovanie hodnoty',
        affirmation: 'Som pokojne disciplinovaný a pevný vo svojom smere.',
        script: 'Dnes budujem to, èo má hodnotu',
        meditation_text: '',
        push_text: ''
    };
    try {
        console.log('Sending to OpenAI...');
        const result = await translateMindsetToSSML(textContent, 'cs');
        console.log('Translation Result:', result);
    } catch (e) {
        console.error('Error during translation:', e);
    }
}
run();
