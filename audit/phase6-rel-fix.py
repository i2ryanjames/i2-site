#!/usr/bin/env python3
"""Add rel='noopener' to every <a target='_blank'> that lacks it."""
import re
from pathlib import Path
ROOT = Path("/Users/ryancorrigan/Desktop/i2 Ministries/i2-site")
PAGES = [
    "index.html", "about.html", "mission.html", "get-trained.html",
    "donate.html", "donate-form.html", "contact.html",
    "mmwu.html", "the-initiative.html", "wise-global.html",
]

def fix_anchor(m):
    attrs = m.group(1)
    # Check for existing rel
    rel_match = re.search(r'\brel\s*=\s*(["\'])([^"\']*)\1', attrs)
    if rel_match:
        rel_val = rel_match.group(2)
        tokens = set(rel_val.split())
        if 'noopener' in tokens:
            return m.group(0)  # already OK
        tokens.add('noopener')
        # Also add noreferrer for privacy
        tokens.add('noreferrer')
        new_rel = ' '.join(sorted(tokens))
        new_attrs = re.sub(
            r'\brel\s*=\s*(["\'])([^"\']*)\1',
            f'rel="{new_rel}"',
            attrs
        )
    else:
        # Inject rel="noopener noreferrer" after target
        new_attrs = re.sub(
            r'(\btarget\s*=\s*(["\'])_blank\2)',
            r'\1 rel="noopener noreferrer"',
            attrs,
            count=1
        )
    return f'<a {new_attrs}>'

for name in PAGES:
    p = ROOT / name
    src = p.read_text(encoding='utf-8')
    # Match any <a ... target="_blank" ...> anchor
    pat = re.compile(r'<a\s+([^>]*target\s*=\s*(["\'])_blank\2[^>]*)>', re.IGNORECASE)
    new, n = pat.subn(fix_anchor, src)
    if new != src:
        p.write_text(new, encoding='utf-8')
        # Count how many changed
        fixed = 0
        for m in pat.finditer(src):
            if 'noopener' not in m.group(1):
                fixed += 1
        print(f'[ok] {name}: {fixed} anchors updated')
    else:
        print(f'[skip] {name}: nothing to fix')
