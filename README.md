# Cinematic Studio — Selfie Social Society

In-engine 3D director for authoring the game's nonplayable moments
(cutscenes, character intros, event cinematics).
Part of the Creator Suite (external editors for expanding the game).

## What it does
- **Real game models in the viewport** (Three.js): the actual avatar template
  (`assets/snug-avatar-template.glb` — peg body, coin head, hands, wedge feet,
  byte-identical to the game's), the 13 painted NPC faces
  (`assets/npc-faces/` — current v2 art from the game's live NPC manifest),
  signature NPC outfits (`assets/npc-outfits/` — current v2 wraparounds),
  and real prop GLBs (`assets/props/` — fence gate, lantern posts, park bench,
  signpost, all byte-identical to the game's). No substitute/cartoon stand-ins.
- Cast picker: Player Avatar + all 13 NPCs, each in their real face + outfit
- Real poses from the game's pose library (`vendor/snug-pose-library.js`):
  neutral, wave, bow, cheer, point, shrug, think, curtsy
- Stage a 3D viewport: place actors, set poses, block positions
- Camera track: keyframed camera moves (pans, pushes, orbits)
- Lighting track: theatrical lighting cues per beat
- XYZ transforms + motion paths per actor
- Timeline playback with input locking (game input locked during cinematics)
- Sequence import (reload a saved sequence to keep editing)
- **Game-ready JSON export** → drop into `assets/cinematics/` in the game repo
  (`Kmberry1989/selsocsoc`), then open the game with `?cine=<id>` to play it
  in town (the game's cinematic player, `assets/cinematic-player.js`, stages
  the sequence with roster-style figures, poses, camera, lighting, and dialogue)

## Run it
Open `index.html` in a browser. The studio loads the game's live NPC manifest
for the current cast, faces, and outfits when online; the bundled
`assets/npc-faces/` and `assets/npc-outfits/` copies (same current art) cover
offline use. Vendor libs (`vendor/`) are bundled; Google Fonts needs network.

## Asset sources (all real game files, never redrawn)
- `assets/snug-avatar-template.glb` ← game's avatar template (byte-identical)
- `assets/npc-faces/` ← game's painted NPC faces, current v2 art
- `assets/npc-outfits/` ← game's NPC outfit PNGs, current v2 wraparounds
- `assets/outfit-textures/` ← game's player outfit PNGs
- `assets/props/` ← game's environment prop GLBs (byte-identical)
- `vendor/snug-pose-library.js` ← game's pose data + PoseController

## Notes
- Game repo: `Kmberry1989/selsocsoc` (the game itself; this tool is separate)
- This tool's exports feed the game: cinematic JSON sequences the game plays
  for nonplayable moments. Figures in the studio use the player avatar
  template; in town the game stages sequences with roster-style figures
  (coin heads floating above the body, as in the game).
- To refresh this repo from the hosted artifact: export the `cinematic-studio`
  artifact and replace `index.html`.
