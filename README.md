# Cinematic Studio — Selfie Social Society

In-engine 3D director for authoring the game's nonplayable moments
(cutscenes, character intros, event cinematics).
Part of the Creator Suite (external editors for expanding the game).

## What it does
- **Real game models in the viewport** (Three.js): the actual avatar template
  (`assets/snug-avatar-template.glb` — peg body, coin head, hands, wedge feet),
  the 11 painted NPC faces (`assets/npc-faces/`), signature NPC outfits
  (`assets/npc-outfits/`), and real prop GLBs (`assets/props/` — fence gate,
  lantern posts, park bench, signpost). No substitute/cartoon stand-ins.
- Cast picker: Player Avatar + all 11 NPCs, each in their real face + outfit
- Real poses from the game's pose library (`vendor/snug-pose-library.js`):
  neutral, wave, bow, cheer, point, shrug, think, curtsy
- Stage a 3D viewport: place actors, set poses, block positions
- Camera track: keyframed camera moves (pans, pushes, orbits)
- Lighting track: theatrical lighting cues per beat
- XYZ transforms + motion paths per actor
- Timeline playback with input locking (game input locked during cinematics)
- Sequence import (reload a saved sequence to keep editing)
- **Game-ready JSON export** → drop into `assets/cinematics/` in the game repo
  (`Kmberry1989/selsocsoc`)

## Run it
Open `index.html` in a browser. Vendor libs (`vendor/`) and game assets
(`assets/`) are bundled in the repo — no network needed except Google Fonts.

## Asset sources (all real game files, never redrawn)
- `assets/snug-avatar-template.glb` ← game's avatar template
- `assets/npc-faces/` ← game's painted NPC faces
- `assets/npc-outfits/` ← game's NPC outfit PNGs (byte-identical)
- `assets/outfit-textures/` ← game's player outfit PNGs
- `assets/props/` ← game's environment prop GLBs
- `vendor/snug-pose-library.js` ← game's pose data + PoseController

## Run it
Open `index.html` in a browser — it's fully self-contained.

## Notes
- Game repo: `Kmberry1989/selsocsoc` (the game itself; this tool is separate)
- This tool's exports feed the game: cinematic JSON sequences the game plays
  for nonplayable moments.
- To refresh this repo from the hosted artifact: export the `cinematic-studio`
  artifact and replace `index.html`.
