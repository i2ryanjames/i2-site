# Cookie notice clarification — 2026-09-26

Ryan asked whether the existing notification was intended for EU cookie compliance. It already controlled optional embedded videos, but its heading and technical language did not communicate that clearly.

The notice now says “Cookies & privacy”, explains the optional YouTube/Vimeo behavior, and presents “Reject optional” and “Accept optional” with identical styling. Settings explain essential storage and optional videos. The mobile notice uses a smaller heading, shorter copy, and safe-area padding. Consent behavior and existing saved choices are preserved. No analytics or advertising categories have been invented.

Verification: existing automated suite 9/9; browser consent checks 10/10 (`browser-checks.json`), covering no third-party requests before consent, rejection, one-time playback, acceptance, and withdrawal. Screenshot: `mobile-390.png`. Code and first-load network inspection found no analytics or advertising trackers.

Reference: [CNIL cookie guidance and current FAQ](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ), particularly first-layer refusal and withdrawal. [EDPB Cookie Banner Taskforce report](https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf).

Scope: this is a wording/layout improvement and a technical check of the current video consent mechanism, not a comprehensive legal certification or an audit of third-party players after playback begins.
