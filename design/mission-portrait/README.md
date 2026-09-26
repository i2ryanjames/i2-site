# Mission portrait — 2026-09-26

Generated with the built-in image generation tool. Fictional subjects, not a photograph of ministry participants. Original PNG has an alpha channel; WebP is a compressed derivative preserving transparency. Applied to the homepage mission section only. Existing copy, counter timing, links, and fonts are preserved.

## Review and verification

- Google Stitch concept: https://stitch.withgoogle.com/projects/3367448312295886192
- Stitch supported the photographic portrait direction. Its generated certifications and alternate typography were not adopted. `stitch-concept.png` is reference only.
- Implemented previews: `desktop-1440.png` and `mobile-390.png`.
- Browser: image loads from the 289 KB WebP; PNG fallback is 1448 × 1086 with alpha. At 1440px and 390px the page has no horizontal overflow, and the counter continues updating on its original schedule.
- Existing test suite: 9/9 passed; static asset/security checks rerun after the final HTML edit: 2/2 passed. `git diff --check` passed.
- Initial image review was local. Ryan authorized publication on September 26, 2026; deployment status is tracked in Git and Vercel.

## Image generation prompt

Use case: photorealistic-natural. Asset type: transparent PNG portrait cutout for the i2 Ministries website's mission section, replacing a stiff white line-art crowd icon. Create one beautiful editorial photographic group portrait of a fictional multigenerational Muslim family of four: a middle-aged father wearing a muted slate-blue shirt (no headwear), mother wearing a soft taupe hijab, grandmother wearing an ivory headscarf, and their 10-year-old daughter wearing a simple sand-colored blouse with natural dark hair. Warm dignified expressions, relaxed and human, slight natural smiles, authentic facial detail and natural skin texture, not glossy beauty retouching. The four people stand close together as a family in a balanced softly overlapping composition, all faces clearly visible and distinct, waist-up framing, complete heads and shoulders safely inside frame. Father at back left, mother near center, grandmother at right, daughter slightly in front left. Natural gently directional daylight, soft shadows, restrained slate blue, oat and warm neutral clothing. No religious props, no dramatic hardship, no stereotypes or exaggerated features. Real photographic texture, 85mm editorial portrait look. ISOLATED ON A GENUINELY TRANSPARENT BACKGROUND with clean alpha-channel edges around hair and fabric; no background scene, no white rectangle, no checkerboard pattern baked into pixels, no drop shadow, no text, no numbers, no logos. Landscape composition approximately 4:3, suitable for display about 600px wide. Bottom crops across the waists cleanly; all other silhouette edges fully visible. Output transparent PNG.
