#!/usr/bin/env python3
"""
Phase 3 shell integration.

For each HTML page in the site root, apply:
  1. Inject <link rel="stylesheet" href="/styles/tokens.css"> before </head>
     (idempotent — skip if already present)
  2. Inject skip-to-main link + open <main id="main"> after <body> opening tag,
     and insert </main> immediately before <footer>
  3. Convert the three footer-column <h4>Ministry/Training/Tools</h4> tags
     to <h3> (fixes heading-order a11y)
  4. Update the .footer-col CSS selector from h4 to h3 to match
  5. Convert .training-stat-item <h4> elements to <h3> (same reason)

Idempotent: safe to re-run. Reports per-file what changed.
"""

import re
import sys
from pathlib import Path

ROOT = Path("/Users/ryancorrigan/Desktop/i2 Ministries/i2-site")
PAGES = [
    "index.html", "about.html", "mission.html", "get-trained.html",
    "donate.html", "donate-form.html", "contact.html",
    "mmwu.html", "the-initiative.html", "wise-global.html",
]

TOKENS_LINK = '<link rel="stylesheet" href="/styles/tokens.css">'
SKIP_LINK = '<a href="#main" class="skip-to-main">Skip to main content</a>'
SKIP_LINK_CSS = """<style>
.skip-to-main{position:absolute;left:-9999px;top:0;z-index:9999;padding:12px 20px;background:#13110E;color:#FAF7F2;font-weight:600;border-radius:6px;text-decoration:none;font-family:inherit;font-size:14px;}
.skip-to-main:focus-visible{left:16px;top:16px;}
</style>"""

def process(src: str, filename: str) -> tuple[str, list[str]]:
    notes = []
    out = src

    # 1. Inject tokens.css link before </head>
    if TOKENS_LINK not in out:
        if "</head>" in out:
            out = out.replace("</head>", f"  {TOKENS_LINK}\n  {SKIP_LINK_CSS}\n</head>", 1)
            notes.append("+tokens.css link")
        else:
            notes.append("!NO </head> FOUND")
    else:
        notes.append("=tokens.css already linked")

    # 2. Skip-to-main + <main> landmark
    if 'class="skip-to-main"' not in out:
        # Insert skip link as first <body> child
        m = re.search(r"(<body[^>]*>)", out)
        if m:
            out = out[:m.end()] + "\n" + SKIP_LINK + out[m.end():]
            notes.append("+skip-to-main link")

    if '<main id="main"' not in out:
        # Insert <main id="main"> after </nav>
        if "</nav>" in out:
            # Find first </nav>
            idx = out.find("</nav>")
            end = idx + len("</nav>")
            out = out[:end] + '\n\n<main id="main">\n' + out[end:]
            notes.append("+<main> opens after nav")
        else:
            notes.append("!NO </nav> FOUND")

        # Insert </main> before first <footer
        m = re.search(r"(\n\s*<footer\b)", out)
        if m:
            out = out[:m.start()] + "\n\n</main>\n" + out[m.start():]
            notes.append("+</main> closes before footer")
        else:
            notes.append("!NO <footer> FOUND")

    # 3. Footer column h4 → h3 (only for these three literal labels)
    for label in ("Ministry", "Training", "Tools"):
        # Match <h4>Ministry</h4> in footer-col exactly
        # Use a cautious pattern: <h4 attrs?>Label</h4>
        pat = re.compile(r"<h4(\s[^>]*)?>(\s*)" + re.escape(label) + r"(\s*)</h4>")
        new = pat.sub(lambda m: f"<h3{m.group(1) or ''}>{m.group(2)}{label}{m.group(3)}</h3>", out)
        if new != out:
            notes.append(f"footer h4→h3: {label}")
            out = new

    # 4. CSS selector update: .footer-col h4 → .footer-col h3
    #    (Match with anything after footer-col before h4, to handle descendant combinators)
    css_before = out
    out = re.sub(r"(\.footer-col\s[^{}]*?)h4(\s*\{)", r"\1h3\2", out)
    if out != css_before:
        notes.append("CSS: .footer-col h4 → h3")

    # 5. Convert .training-stat-item h4 and similar stat-card h4s → h3
    # Target well-known stat patterns inline
    stat_targets = [
        ("training-stat-item", r"(\.training-stat-item\s+)h4"),
        ("stat-num",            None),  # handled separately below
    ]
    for name, pattern in stat_targets:
        if pattern:
            css_before = out
            out = re.sub(pattern + r"(\s*\{)", r"\g<1>h3\g<2>", out)
            if out != css_before:
                notes.append(f"CSS: .{name} h4 → h3")

    # HTML: convert <h4>NUMBER</h4> inside <div class="training-stat-item"> to <h3>
    # Scope by regex: look for training-stat-item div, then next h4...</h4> inside it
    def convert_stat_h4_to_h3(html: str, parent_class: str) -> tuple[str, int]:
        count = 0
        # Pattern: <div class="parent_class">...<h4>X</h4>...</div>
        # We'll do it in multiple passes — one h4 per div
        pat = re.compile(
            r'(<div\s+class="[^"]*\b' + re.escape(parent_class) + r'\b[^"]*"[^>]*>\s*)'
            r'<h4([^>]*)>([^<]*)</h4>',
            re.DOTALL,
        )
        new_html, n = pat.subn(lambda m: f"{m.group(1)}<h3{m.group(2)}>{m.group(3)}</h3>", html)
        return new_html, n

    out, n1 = convert_stat_h4_to_h3(out, "training-stat-item")
    if n1:
        notes.append(f"HTML: {n1} × training-stat-item h4→h3")

    return out, notes


def main():
    for page in PAGES:
        path = ROOT / page
        if not path.exists():
            print(f"[SKIP] {page} not found")
            continue
        orig = path.read_text(encoding="utf-8")
        new, notes = process(orig, page)
        changed = new != orig
        status = "CHANGED" if changed else "no-op"
        print(f"[{status}] {page}: {', '.join(notes) if notes else 'nothing to do'}")
        if changed:
            path.write_text(new, encoding="utf-8")

if __name__ == "__main__":
    main()
