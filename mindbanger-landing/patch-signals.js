const fs = require('fs');
let f = fs.readFileSync('src/components/admin/SignalsManager.tsx', 'utf8');

const tOld = 'async function handleQuickGenerate(signal: DailySignal) {';
const tNew = \sync function handleTranslateToOtherLanguages(signal: DailySignal) {
    if (!confirm(\\\Naozaj chcete preloûiù tento slovensk˝ mindset (D·tum: \) do ÔalöÌch jazykov (CS, EN)?\\\)) return;
    const toastId = toast.loading(\\\Preklad·m \ do in˝ch jazykov...\\\);
    try {
        const res = await fetch('/api/admin/translate-mindset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceId: signal.id, type: 'personal', targetLanguages: ['cs', 'en'] })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Preklad zlyhal');
        }
        toast.success('Preklad ˙speöne dokonËen˝!', { id: toastId });
        fetchSignals();
    } catch (error: any) {
        toast.error(error.message, { id: toastId });
    }
}

  async function handleQuickGenerate(signal: DailySignal) {\;

f = f.replace(tOld, tNew);

const btnOld = '<button onClick={() => handleEdit(s)}';
const btnNew = \{s.language === 'sk' && (
                            <button
                                onClick={() => handleTranslateToOtherLanguages(s)}
                                title="Preniesù do ostatn˝ch jazykov"
                                className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors mr-1"
                            >
                                <Languages size={18} />
                            </button>
                         )}
                         <button onClick={() => handleEdit(s)}\;

f = f.replace(btnOld, btnNew);

fs.writeFileSync('src/components/admin/SignalsManager.tsx', f);
