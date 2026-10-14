# Cinematic Studio — Selfie Social Society

In-engine 3D director for authoring the game's nonplayable moments
(cutscenes, character intros, event cinematics).
Part of the Creator Suite (external editors for expanding the game).

## What it does
- Stage a 3D-style viewport: place actors, set poses, block positions
- Camera track: keyframed camera moves (pans, pushes, orbits)
- Lighting track: theatrical lighting cues per beat
- XYZ transforms + motion paths per actor
- Timeline playback with input locking (game input locked during cinematics)
- Sequence import (reload a saved sequence to keep editing)
- **Game-ready JSON export** → drop into `assets/cinematics/` in the game repo
  (`Kmberry1989/selsocsoc`)

## Run it
Open `index.html` in a browser — it's fully self-contained.

## Notes
- Game repo: `Kmberry1989/selsocsoc` (the game itself; this tool is separate)
- This tool's exports feed the game: cinematic JSON sequences the game plays
  for nonplayable moments.
- To refresh this repo from the hosted artifact: export the `cinematic-studio`
  artifact and replace `index.html`.
