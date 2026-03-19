
import { buildDailyContext, formatContextForPrompt } from '../src/lib/content-engine/context';

const dateStr = '2026-03-18'; // Usage date from context
const context = buildDailyContext(dateStr);
const formatted = formatContextForPrompt(context);

console.log('--- Context Object ---');
console.log(JSON.stringify(context, null, 2));
console.log('\n--- Formatted String ---');
console.log(formatted);
