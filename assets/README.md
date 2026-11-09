# Current fan-game assets

Pokémon sprites replace all monster rendering. See pokemon/asset-manifest.json and ../THIRD_PARTY_NOTICES.md. The records below document preserved inactive original art.

# Art sources

## Active assets

- `monsters.png`: original monster art generated with the built-in `image_gen` tool, copied into this project. Transparent 1254 × 1254 PNG. No external image calls at runtime.
- `forest.svg`: code-native pixel forest scene made for this game.

## Evolution rule

Only **one base sprite per species** is used. The runtime uses atlas cells 0, 1, 2, 3, 7, 11 and 12 (zero-based, row-major). All evolution levels and routes reuse those same cells. CSS scale, tint and aura provide the evolution effect. Tests enforce this invariant.

The generation request below preceded the user's correction about evolution art. The sheet contains unused variants, but the game never selects them. Do not add evolution sprite mappings. No further evolution art is needed.

## Original generation prompt (built-in tool)

Use case: stylized-concept. Asset type: ONE production game sprite atlas for a monster-collecting RPG, a precise 4-column by 4-row square grid, 16 equal cells. Make a 2048x2048 PNG with REAL TRANSPARENT BACKGROUND (alpha), no background artwork, no checkerboard, no labels, no text, no frames. Every creature fully contained centered inside its own 512x512 cell with 50px transparent padding, feet aligned near bottom of cell, all sprites same visual quality. Sharp detailed 32-bit handheld JRPG pixel art, limited vivid color clusters, dark outlines, strong silhouettes, confident battle-ready poses facing LEFT in three-quarter front view. These are ORIGINAL creatures with the collectibility, striking silhouettes, and evolution appeal of classic monster-taming games. Not plush blobs, not toddler clipart. Some cool, some mysterious, some cute. ROW 1: cell1 small agile emerald leaf-blade raptor with angular head and leaf tail; cell2 red-orange fire wolf cub with pointed ears, black paws and fiery tail; cell3 blue armored shark pup standing on hind legs with fin blades; cell4 purple mushroom rogue with a large spotted cap, hidden glowing eyes and two short leaf daggers. ROW 2: cell1 evolved emerald raptor with longer bladed forearms and neck frill; cell2 evolved red fire wolf with volcanic armor shoulders and burning mane; cell3 evolved blue armored shark knight with a large dorsal blade and silver plates; cell4 gold and black electric scarab beetle with large forked horns. ROW 3: cell1 final evolution tall powerful emerald dragon-raptor with giant leaf-scythe arms and plated tail; cell2 final evolution towering fire wolf with magma armor and a huge flowing flame mane, quadruped; cell3 final evolution mighty deep-blue hammerhead shark paladin with jagged silver armor and two fin swords; cell4 dark indigo raven-griffin with cyan lightning wing tips. ROW 4: cell1 HUGE dark purple and crimson horned dragon boss with six wings, gold armor, intimidating but child-friendly, fit entirely within cell; cell2 evolved tall purple mushroom assassin with giant pointed cap and long green blades; cell3 evolved gold-black electric stag beetle with massive horns and lightning claws; cell4 evolved storm raven-griffin with long cyan wing blades and crown crest. All 16 cells exact regular grid, do not overlap, no grounded shadows or platforms. Transparent background is critical for layering these sprites onto an in-game landscape. No existing franchise characters.

## Species expansion

- `monsters-wildlands.png`: 16 new distinct monster bodies, 4×4 transparent atlas.
- `monsters-mythwilds.png`: 16 further distinct monster bodies, 4×4 transparent atlas.
- Both sheets were generated and layout-corrected with the built-in `image_gen` tool. Full prompts: [monster-expansion-prompts.md](monster-expansion-prompts.md).
- Cell mapping, names, types and stage availability: [monster-roster.md](monster-roster.md).
- The seven original species retain their original atlas cells. New sheets are additional species, never evolution variants. Total roster: 39 (38 wild + 1 boss).
- Recolor variants are a future extension, not counted as new bodies in this release.

### Deepwilds addition

`monsters-deepwilds.png` adds another 16 original bodies, bringing the current total to **55 species (54 wild + 1 boss)**. The built-in `image_gen` tool produced the atlas; [deepwilds-prompt.md](deepwilds-prompt.md) records the prompt. The expanded roster document includes every species. Original bodies are counted once; evolution and future palettes do not inflate this count.

## Dragon bosses
`monsters-dragons.png`: ten original dragon boss sprites generated using built-in imagegen. See `boss-dragons.md` and `boss-dragon-prompts.md`. One permanent sprite per species.
