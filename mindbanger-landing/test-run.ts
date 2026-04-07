import { translateMindset } from './src/lib/content-engine/openai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
    try {
        const textContent = {
            theme: 'Hodnota',
            focus: 'Budovanie hodnoty',
            affirmation: 'Som pokojne disciplinovaný.',
            script: 'Dnes budujem to, èo má hodnotu',
            meditation_text: '',
            push_text: ''
        };
        console.log('Sending to OpenAI...');
        const result = await translateMindset(textContent, 'cs');
        console.log('Result:', result);
    } catch (e) {
        console.error('Error:', e);
    }
}
run();
