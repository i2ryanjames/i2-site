#!/usr/bin/env python3
"""
Phase 5 motion layer integration.

For each HTML page, inject GSAP + ScrollTrigger CDN scripts and
/js/animations.js before </body>. Idempotent — skip if already present.
"""
from pathlib import Path
import re

ROOT = Path("/Users/ryancorrigan/Desktop/i2 Ministries/i2-site")
PAGES = [
    "index.html", "about.html", "mission.html", "get-trained.html",
    "donate.html", "donate-form.html", "contact.html",
    "mmwu.html", "the-initiative.html", "wise-global.html",
]

MARKER = "<!-- phase5-motion -->"
BLOCK = (
    '\n' + MARKER + '\n'
    '<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>\n'
    '<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>\n'
    '<script src="/js/animations.js" defer></script>\n'
)

for name in PAGES:
    p = ROOT / name
    src = p.read_text(encoding='utf-8')
    if MARKER in src:
        print(f"[skip] {name}: already injected")
        continue
    if "</body>" not in src:
        print(f"[warn] {name}: no </body> found")
        continue
    new = src.replace("</body>", BLOCK + "\n</body>", 1)
    p.write_text(new, encoding='utf-8')
    print(f"[ok] {name}: motion layer injected")
