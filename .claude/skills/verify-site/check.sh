#!/usr/bin/env bash
# Static checks for the site. Usage: bash .claude/skills/verify-site/check.sh
set -e
cd "$(dirname "$0")/../../.."
python3 -I - <<'P'
import re, json, subprocess, tempfile, os, sys
s = open('index.html').read()
ok = True
json.load(open('manifest.json')); print('manifest.json: valid JSON')
js = '\n'.join(re.findall(r'<script>(.*?)</script>', s, re.S))
with tempfile.TemporaryDirectory() as d:
    p = os.path.join(d, 't.js'); open(p, 'w').write(js)
    r = subprocess.run(['node', '--check', p], capture_output=True, text=True)
    print('inline JS syntax:', 'ok' if r.returncode == 0 else r.stderr); ok &= r.returncode == 0
r = subprocess.run(['node', '--check', 'sw.js'], capture_output=True, text=True)
print('sw.js syntax:', 'ok' if r.returncode == 0 else r.stderr); ok &= r.returncode == 0
ids = set(re.findall(r'id="([^"]+)"', s))
for m in sorted(set(re.findall(r"getElementById\('([^']+)'\)", s))):
    if m not in ids: print('MISSING id:', m); ok = False
for n in re.findall(r"switchWudhuSub\('(?:wudhu-)?([^']+)'\)", s):
    for need in (f'wudhu-sub-{n}', f'sub-wudhu-{n}'):
        if need not in ids: print('MISSING wudhu id:', need); ok = False
for n in re.findall(r"switchTab\('([^']+)'\)", s):
    for need in (f'content-{n}', f'tab-{n}'):
        if need not in ids: print('MISSING tab id:', need); ok = False

# Validasi bank soal kuis (jalankan kode bank di Node)
a = s.index("        const mc = (id"); b = s.index("5. UTILITIES")
with tempfile.TemporaryDirectory() as d:
    p = os.path.join(d, 'bank.js')
    open(p, 'w').write(s[a:b].rsplit('/*', 1)[0] + r"""
const ids = new Set(); let bad = 0;
const err = (m) => { console.log('QUIZ:', m); bad++; };
for (const q of quizBank) {
  if (ids.has(q.id)) err('id ganda ' + q.id); ids.add(q.id);
  if (!q.q || !q.exp || !q.src) err('teks/penjelasan/sumber kosong ' + q.id);
  if (q.t === 'mc' || q.t === 'fill') {
    if (q.opts.length !== 4 || new Set(q.opts).size !== 4) err('opsi harus 4 & unik ' + q.id);
    if (q.t === 'fill' && !q.ar.includes('____')) err('fill tanpa ____ ' + q.id);
  } else if (q.t === 'order') { if (new Set(q.items).size !== q.items.length || q.items.length < 3) err('order ' + q.id); }
  else if (q.t === 'match') { if (q.pairs.length !== 4 || new Set(q.pairs.map(x => x[1])).size !== 4) err('match ' + q.id); }
  else if (q.t === 'tf') { if (typeof q.a !== 'boolean') err('tf ' + q.id); }
  else err('tipe tidak dikenal ' + q.id);
}
console.log('quiz bank:', quizBank.length, 'soal,', bad ? bad + ' masalah' : 'ok');
process.exit(bad ? 1 : 0);
""")
    r = subprocess.run(['node', p], capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip()); ok &= r.returncode == 0
sw = open('sw.js').read()
for f in re.findall(r"'\./([^']+\.(?:html|json|jpg|png))'", sw):
    if not os.path.exists(f): print('SW precache file missing:', f); ok = False
print('CACHE_NAME:', re.search(r"CACHE_NAME = '([^']+)'", sw).group(1))
print('RESULT:', 'PASS' if ok else 'FAIL'); sys.exit(0 if ok else 1)
P
