const fs = require('fs');
const path = 'c:/Users/miros/Documents/Mindbanger.com/mindbanger-landing/src/components/admin/AffiliateManager.tsx';
let code = fs.readFileSync(path, 'utf8');

// We will add type Referral and State
const typeDef = 
type Referral = {
  id: string;
  created_at: string;
  commission_amount: number;
  commission_model: string;
  status: string;
  affiliates: {
    paypal_email: string;
  };
};
;

code = code.replace(/type PromoMaterial = \{/s, typeDef + '\ntype PromoMaterial = {');

code = code.replace(
  'const [materials, setMaterials] = useState<PromoMaterial[]>([]);',
  'const [materials, setMaterials] = useState<PromoMaterial[]>([]);\n  const [referrals, setReferrals] = useState<Referral[]>([]);'
);

const fetchRefs = 
  async function fetchReferrals() {
    const { data } = await supabase
      .from('referrals')
      .select('id, created_at, commission_amount, commission_model, status, affiliates(paypal_email)')
      .order('created_at', { ascending: false });
    if (data) setReferrals(data as any);
  }

  async function markAsPaid(id: string) {
    if(!confirm('Oznaèi túto províziu ako vyplatenú?')) return;
    await supabase.from('referrals').update({ status: 'paid' }).eq('id', id);
    fetchReferrals();
  }
;

code = code.replace(
  'async function fetchMaterials() {',
  fetchRefs + '\n  async function fetchMaterials() {'
);

code = code.replace(
  'fetchMaterials();',
  'fetchMaterials();\n    fetchReferrals();'
);

const referralUI = 
      {/* Provízie na vyplatenie */}
      <div className="mt-16">
        <h2 className="text-2xl font-serif text-white mb-2">Nevyplatené Provízie</h2>
        <p className="text-slate-400 mb-6">Zoznam partnerov èakajúcich na vıplatu s Paypal údajmi.</p>
        
        <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50">
              <tr>
                <th className="p-4 text-sm text-slate-400 font-medium">Dátum</th>
                <th className="p-4 text-sm text-slate-400 font-medium">Model</th>
                <th className="p-4 text-sm text-slate-400 font-medium">Suma</th>
                <th className="p-4 text-sm text-slate-400 font-medium">PayPal Email</th>
                <th className="p-4 text-sm text-slate-400 font-medium">Status</th>
                <th className="p-4 text-sm text-slate-400 font-medium">Akcia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {referrals.filter(r => r.status === 'pending').length === 0 && (
                 <tr><td colSpan={6} className="p-8 text-center text-slate-500">iadne nevyplatené provízie.</td></tr>
              )}
              {referrals.filter(r => r.status === 'pending').map(ref => (
                <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-slate-300">{new Date(ref.created_at).toLocaleDateString('sk-SK')}</td>
                  <td className="p-4 text-slate-300">
                    <span className="px-2 py-1 text-xs rounded bg-slate-800 border border-white/5">
                      {ref.commission_model === 'second_month' ? '100% 2. Mesiac' : '20% Lifetime'}
                    </span>
                  </td>
                  <td className="p-4 text-amber-400 font-bold">{ref.commission_amount} €</td>
                  <td className="p-4 text-slate-300">{ref.affiliates?.paypal_email || 'Nepriradenı'}</td>
                  <td className="p-4 text-amber-500 text-sm font-medium uppercase tracking-wider">Èaká</td>
                  <td className="p-4">
                    <button 
                      onClick={() => markAsPaid(ref.id)}
                      className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-colors border border-emerald-500/20"
                    >
                      Zaplati
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
;

code = code.replace(
  '    </div>\n  );\n}',
  referralUI + '\n    </div>\n  );\n}'
);

fs.writeFileSync(path, code);
