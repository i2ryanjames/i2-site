# Anonymous crowd replacement — 2026-09-26

**Follow-up:** The homepage retains this treatment. Ryan subsequently requested a distinct background image with overlaid text on the Mission page; see `../mission-overlay/README.md` for that revision.

Ryan requested a vast crowd in a Muslim-majority country with no personal faces, because the counter describes daily deaths. The earlier family portrait was rejected. This replacement also applies to /the-mission, where the old clip-art icon remained.

Generated using the built-in image generator. The crowd and city are fictional, not documentary evidence of a particular event. People are shown from behind at a distance, without identifiable faces. No deaths or injuries are depicted. Both pages use the same full-bleed image and a separate live text counter below it.

Assets: public/images/mission-crowd.png and mission-crowd.webp. New filenames avoid the site's immutable image cache.

## Verification

- Homepage and Mission page reviewed at 1440px and 390px, with screenshots and browser check results saved alongside this file.
- All four views load the crowd image, show no horizontal overflow, and retain the updating live counter.
- Existing automated suite: 9/9. Static asset/security checks after removing the rejected public family assets: 2/2. `git diff --check` passed.

## Prompt

Use case: photorealistic-natural. Asset type: wide website editorial background image for a Christian mission statistics panel, approximately 3:2 landscape, PNG. Create an entirely AI-generated fictional scene conveying the immense scale of the Muslim world, with NO recognizable people and NO visible personal faces. Very high elevated viewpoint above and behind a vast, dense crowd of thousands moving away from the camera through a broad stone plaza and boulevard in a Muslim-majority country, inspired by Cairo, Egypt. Distant restrained limestone mosque architecture with slender minarets on the far horizon grounds the location without depicting a specific famous event. The crowd fills nearly the entire foreground and middle distance and recedes far toward the horizon. Every human is small in the frame, seen exclusively from behind or directly overhead: only backs, shoulders, head coverings, and the tops or backs of heads. No face is visible anywhere, even in the nearest foreground. No foreground portrait, no hero subject, no large distinct individual, no one looking back toward camera. Modest varied everyday clothing, subtle neutral tones, cream, stone, charcoal and slate. Natural documentary photographic aesthetic, atmospheric depth, soft overcast late-afternoon light, subdued and contemplative, dignified and humane. Visually coherent realistic crowd with varying spacing, not cloned rows. The image is about population scale, not an actual death event: normal peaceful crowd, no injury, no bodies on ground, no disaster, no funeral, no panic, no threatening imagery, no flags, no banners, no readable lettering, no text, no numbers, no logo, no watermark. Strong spatial depth, quiet natural colors compatible with a deep-blue website. Full-bleed image with ordinary background, NOT transparent, no cutout, no border or layout mockup. Only generate the image asset.
