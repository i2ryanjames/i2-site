# Mission page image overlay — 2026-09-26

Ryan requested a different image for /the-mission, with the counter text overlaid and very readable. The homepage retains the earlier Cairo-inspired street crowd and separate blue counter band.

Generated with the built-in image generator. This fictional Lahore-inspired courtyard scene contains a distant anonymous crowd without identifiable faces. The live number and label remain HTML, layered over a CSS dark gradient. The picture fills the panel on desktop and mobile.

Assets: public/images/mission-courtyard.png and public/images/mission-courtyard.webp.

## Verification

- Reviewed at 1440px, 390px, and 320px; screenshots and browser results are saved alongside this file.
- Live counter updates; image loads; all text stays inside the image; no horizontal overflow at any tested width.
- Conservative contrast calculation (assuming white image pixels behind the gradient): number at least 7.7:1 and label at least 13.21:1 across the tested layouts.
- Static asset/security checks: 2/2 passed. `git diff --check` passed. Homepage HTML and its image references are unchanged.

## Prompt

Use case: photorealistic-natural. Asset type: full-bleed landscape background image for a mission website counter panel. Generate an entirely fictional aerial documentary-style scene of an immense Muslim crowd filling an expansive mosque courtyard in a city inspired by Lahore, Pakistan. Distinct from a street scene: broad pale stone courtyard, elegant sandstone arcades along the sides, domes and tall minarets far in the upper background. Camera very high above and behind the crowd, looking down obliquely so every person is very small and only backs or tops of heads are visible. Absolutely NO visible or identifiable faces, no person looking toward camera, no foreground portrait, no distinct individual. Thousands of people in varied modest everyday clothing, cream, slate, muted grey-blue, densely dispersed across the courtyard, realistic natural variations in position and spacing. Peaceful ordinary gathering, dignified and contemplative. Cool early morning atmosphere, soft diffused blue-grey light, atmospheric distance, restrained deep slate and stone palette with subtle sandstone warmth. Sharp believable architecture and coherent crowd geometry. Landscape composition ideally 16:9, with the architecture and the most visible expanse of the crowd in the upper two thirds; lower third darker and visually quieter because a separate white live counter will be overlaid in website CSS. Do not bake any text, numbers, buttons, gradient overlays or UI into the image. No injury, no death, no funeral, no disaster, no panic, no military, no flags, no banners, no readable lettering, no logos, no watermark. No large foreground faces or identifiable people. This is a fictional illustrative scene, not a record of a real event. Output one high-quality PNG image.
