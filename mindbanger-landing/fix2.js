const fs = require('fs');
const files = [
  'src/app/api/admin/generate-audio/route.ts',
  'src/app/api/admin/generate-content/route.ts',
  'src/app/api/admin/get-audio-url/route.ts',
  'src/app/api/admin/translate-mindset/route.ts'
];
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/if \(\!\(await checkAdminAuth\(\)\)\) return NextResponse\.json\(\{ error: 'Unauthorized Admin' \}, \{ status: 401 \}\);, \{ status: 401 \}\);/g, "if (!(await checkAdminAuth())) return NextResponse.json({ error: 'Unauthorized Admin' }, { status: 401 });");
  c = c.replace(/if \(\!\(await checkAdminAuth\(\)\)\) return NextResponse\.json\(\{ error: 'Unauthorized Admin' \}, \{ status: 401 \}\);\s*\}/g, "if (!(await checkAdminAuth())) { return NextResponse.json({ error: 'Unauthorized Admin' }, { status: 401 }); }");
  fs.writeFileSync(f, c);
}
console.log('Fixed');