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
sw = open('sw.js').read()
for f in re.findall(r"'\./([^']+\.(?:html|json|jpg|png))'", sw):
    if not os.path.exists(f): print('SW precache file missing:', f); ok = False
print('CACHE_NAME:', re.search(r"CACHE_NAME = '([^']+)'", sw).group(1))
print('RESULT:', 'PASS' if ok else 'FAIL'); sys.exit(0 if ok else 1)
P
