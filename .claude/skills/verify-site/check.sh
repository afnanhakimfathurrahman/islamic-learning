#!/usr/bin/env bash
# Static checks for the site. Usage: bash .claude/skills/verify-site/check.sh
set -e
cd "$(dirname "$0")/../../.."
python3 -I - <<'P'
import re, json, subprocess, tempfile, os, sys
import glob
s = open('index.html').read()
jsfiles = sorted(glob.glob('js/**/*.js', recursive=True))
alljs = '\n'.join(open(f).read() for f in jsfiles)
src = s + '\n' + alljs          # markup + semua modul (ID bisa didefinisikan di template JS)
ok = True
json.load(open('manifest.json')); print('manifest.json: valid JSON')
bad = 0
for f in jsfiles:
    r = subprocess.run(['node', '--check', f], capture_output=True, text=True)
    if r.returncode: print('JS syntax error in', f, r.stderr); bad += 1
print('modules (%d files) syntax:' % len(jsfiles), 'ok' if not bad else 'FAIL'); ok &= not bad
# impor relatif harus menunjuk file yang ada
for f in jsfiles:
    for imp in re.findall(r"from '(\.[^']+)'|import '(\.[^']+)'", open(f).read()):
        t = imp[0] or imp[1]
        if not os.path.exists(os.path.normpath(os.path.join(os.path.dirname(f), t))): print('MISSING import', f, '->', t); ok = False
r = subprocess.run(['node', '--check', 'sw.js'], capture_output=True, text=True)
print('sw.js syntax:', 'ok' if r.returncode == 0 else r.stderr); ok &= r.returncode == 0
ids = set(re.findall(r'id="([^"]+)"', src))
for m in sorted(set(re.findall(r"getElementById\('([^']+)'\)", src))):
    if m not in ids: print('MISSING id:', m); ok = False
for n in re.findall(r"switchWudhuSub\('(?:wudhu-)?([^']+)'\)", src):
    for need in (f'wudhu-sub-{n}', f'sub-wudhu-{n}'):
        if need not in ids: print('MISSING wudhu id:', need); ok = False
for n in re.findall(r"switchTab\('([^']+)'\)", src):
    for need in (f'content-{n}', f'tab-{n}'):
        if need not in ids: print('MISSING tab id:', need); ok = False
# handler inline (onclick="fn()") harus diekspos di window lewat js/main.js
main = open('js/main.js').read()
exposed = set(re.findall(r'\b(\w+)\b', main[main.index('Object.assign(window'):]))
for a in re.findall(r"""\bon(?:click|input|change|keydown|submit)\s*=\s*"([^"]*)\"""", src):
    for fn in re.findall(r'(?<![\w$.])([A-Za-z_]\w*)\s*\(', a):
        if fn not in exposed and fn not in ('event',) and re.search(r'(?:function|const)\s+' + fn + r'\b', alljs):
            print('HANDLER not exposed on window:', fn); ok = False

# Validasi bank soal kuis (impor modul data di Node)
with tempfile.TemporaryDirectory() as d:
    p = os.path.join(d, 'bank.mjs')
    open(p, 'w').write("import { quizBank } from 'file://" + os.path.abspath('js/data/quiz.js') + r"""';
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
for f in re.findall(r"'\./([^']+\.(?:html|json|jpg|png|js|css))'", sw):
    if not os.path.exists(f): print('SW precache file missing:', f); ok = False
for f in jsfiles + ['css/app.css']:
    if './' + f not in sw: print('SW precache missing for:', f); ok = False
print('CACHE_NAME:', re.search(r"CACHE_NAME = '([^']+)'", sw).group(1))
print('RESULT:', 'PASS' if ok else 'FAIL'); sys.exit(0 if ok else 1)
P
