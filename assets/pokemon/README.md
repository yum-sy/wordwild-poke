# Local Pokémon assets (Gen I–II)

Generated with `python3 scripts/cache-pokemon.py` (Python 3 + Pillow). Runtime must use the checked-in local files and does not call PokeAPI.

- 251 original species, #001–#251; no regional/mega forms.
- Each species has front/back × normal/shiny static PNG and animated GIF: 2,008 files total.
- Animation source: PokeAPI sprites, generation-v/black-white/animated. The artwork style is Gen V; the species scope remains Gen I–II.
- Every variant was verified. `animated` in roster.json/pokemon-data.js is true only for a complete four-variant animation set.
- PNG/GIF are 96×96 transparent canvases. The alpha-bound union across every animation frame is fit inside 76px, centered, at bottom baseline 88px. Nearest-neighbor resizing preserves pixel edges. GIF frame timing and total duration are retained; full-frame transparency uses disposal=2.
- Source downloads are cached only under ignored `work/pokemon-source-cache/` for reproducibility and retries.
- `source-lock.json` pins immutable sprite and data revisions; `asset-manifest.json` records individual URLs, original/output hashes, dimensions, bounds, durations and frame counts; `data-manifest.json` records CSV URLs and hashes.
- English names, current primary canonical types, direct evolution links, family roots (including Gen II babies), depth, height in metres, legendary/mythical classification come from pinned PokeAPI CSV data. Future-generation evolutions are excluded.

## Runtime guidance

The full checked-in asset collection is approximately 90 MB. Load static portraits by default; animate only the active combatants or a single focused preview. Never preload all GIFs. Keep the same-species/direction/shiny PNG available for reduced motion, hidden-tab suspension and decode/network failure.

## Rights

Pokémon imagery is copyright The Pokémon Company. These media are excluded from the project software license. `UPSTREAM-LICENCE.txt` is the exact pinned upstream notice; its CC0 repository wording does not grant Pokémon IP permission. This archive does not claim that these images are freely reusable or approved for the fan game. See the repository's THIRD_PARTY_NOTICES.md.

Pinned PokeAPI/pokeapi CSV data carries its repository BSD-3-Clause notice, retained exactly in `UPSTREAM-DATA-LICENSE.txt` and linked/hashed in `data-manifest.json`. This notice names Paul Hallett and PokéAPI contributors (2013–2023) and separately identifies Pokémon character names as Nintendo trademarks. It is separate from the image copyright notice and grants no Pokémon IP permission.
