# Rights and sources

This is a free, noncommercial, unofficial fan game. It is not affiliated with or endorsed by Nintendo, Game Freak, Creatures, or The Pokémon Company. No Pokémon IP permission is claimed. Source availability and noncommercial use do not supply that permission.

## Pokémon images

All 2,008 current PNG/GIF files in assets/pokemon are derived from PokeAPI/sprites. The pinned revision is in source-lock.json. Every file has its immutable upstream URL, original SHA-256, local SHA-256, dimensions and alpha bounds in asset-manifest.json. Processing crops transparent padding (union of all frames for GIF) and uses nearest-neighbor scaling onto a 96×96 transparent canvas with bottom baseline 88. Animation frame timing and transparency are preserved. Older unused assets remain only for historical rollback.

Upstream LICENCE.txt states: “All image contents within are Copyright The Pokémon Company.” Its repository CC0 text must not be interpreted as granting Pokémon IP rights. The complete upstream notice is retained in assets/pokemon/UPSTREAM-LICENCE.txt. These images, character names, trademarks and character designs are EXCLUDED from the code license and are not offered as freely reusable media.

Source: https://github.com/PokeAPI/sprites
Official guidance: https://support.pokemon.com/hc/en-us/articles/360000634094-Can-I-use-Pok%C3%A9mon-images-or-materials

## Existing media

Original generated monster atlases are preserved, inactive, for rollback. Existing UI, backgrounds, music (6 tracks and 3 event sounds) and 12 sound effects are retained unchanged. Their existing records remain in assets and audio-previews. Their rights are separate from the software license; this conversion does not claim new redistribution or relicensing rights for them. No blanket license is granted to any media under assets/ or audio-previews/.

## Species metadata

Names, current primary types, evolution links and classifications derive from pinned PokeAPI/pokeapi CSVs. That repository uses BSD-3-Clause. Its exact notice is retained in assets/pokemon/UPSTREAM-DATA-LICENSE.txt; source URLs and SHA-256 are in data-manifest.json. This data repository license does not grant Pokémon trademark or image rights.

## Capture item sprites

`assets/capture/poke-ball.png`, `great-ball.png`, `ultra-ball.png` and `master-ball.png` use PokeAPI's item sprites at the pinned revision in `assets/capture/sources.json`. Pokémon artwork remains © Nintendo / Creatures Inc. / GAME FREAK inc.; it is not covered by this project's MIT license. The local copies are alpha-cropped and nearest-neighbor scaled. Throw, absorption, three shakes, release and capture effects are original CSS choreography, not official game animation frames.

Install icons `assets/icons/pichu-back-*.png` package the cached PokeAPI Pichu back sprite (`assets/pokemon/172-back.png`) on an opaque background with maskable safe padding. The same Pokémon artwork rights apply. Regenerate with `python3 scripts/build-install-icons.py`.
