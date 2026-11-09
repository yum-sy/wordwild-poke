> Historical v1 conversion report. Superseded by POKEMON_SPEC_V2.md and POKEMON_V2_RELEASE.md.

# Pokémon conversion — 2026-11-09

Scope: 64 existing encounter slots, 54 wild + 10 bosses. No encounter eligibility, stats, curriculum, attack, capture, reward or evolution logic changed. Legacy IDs are the stable save/encounter identifiers. Mapping: assets/pokemon/roster.json and src/pokemon-roster.js. Original atlases remain intact for rollback.

Starters: Bulbasaur, Charmander, Squirtle. Boss order: Charizard, Dragonite, Salamence, Torterra, Rayquaza, Flygon, Kingdra, Hydreigon, Zekrom, Giratina. Selection preserves winged, serpentine, turtle, sea, multi-head and legendary silhouettes. Existing game element/skill categories are retained; they are not an implementation of canonical Pokémon types or type matchups.

One consistent static 96px pixel source family, all downloaded from a pinned PokeAPI/sprites revision. 256 images verified for PNG dimensions, alpha content and SHA-256. Transparent padding normalized, common 88px baseline; nearest-neighbor rendering. Cards and collection use front views, active player in battle uses back views. Image failure displays a local question-mark placeholder; no external fallback request. No API calls during gameplay.

Evolution only strengthens the same body with existing size/aura effects. Rare chance remains 1%; Giant:Silver:Gold stays 6:2:1. Giant scales the normal image; Silver uses a grayscale effect; Gold uses the actual shiny front/back image with a gold glow. Pokémon shiny odds are not adopted.

Run, learning, hall, heir, rare collection and music keys use wordwild-pokemon-. PWA name/id and dev port 5174 are separate. No import of original browser records. No remote configured; no push or deployment performed. Automatic push deployment is disabled, manual workflow retained for a separately configured repository. Suggested unused project name is wordwild-pokemon-fangame, availability unverified.

## Verification

- npm run check: pass.
- node --test tests/*.test.js: 85/85 pass, including cache integrity and unchanged evolution identity.
- BASE_PATH=/wordwild-pokemon-fangame/ npm run build: pass.
- Browser viewport checks: 360×560, 667×320, 390×650, 844×390, 768×920, 1024×680, 820×1080, 1180×720, 1024×1366, 1366×768.
- Each size checked home, battle, reading, reward-target, party-management, failed capture, camp, evolution, reward and capture (100 combinations). No document overflow, buttons outside the viewport or completed broken Pokémon images observed.
- Visual inspection: landscape battle front/back, portrait battle and starter selection. Tests use in-memory storage; test harness excluded from build.
- Limits: browser viewport simulation, not physical iPad/Safari testing. Not a full manual 100-stage playthrough. Existing audio files unchanged; audio quality not re-auditioned.

Rights: code MIT only; all Pokémon/media excluded. See THIRD_PARTY_NOTICES.md and the upstream image copyright notice. Free/noncommercial/source-open does not mean IP permission.
