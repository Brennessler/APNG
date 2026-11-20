# Adventa på nå gott — Christmas Video Store

A static advent calendar built with HTML, CSS, vanilla JavaScript, and JSON. Publish this folder as the root of a GitHub Pages site; no build step or package installation is required. Preview it through a local web server because the app fetches `calendar.json`.

## Calendar data

`calendar.json` defines all 24 doors and their cover, physical media, content type, relative content path, and destination view. Keep the destination consistent with its media: VHS goes to `vcr`, cassettes to `radio`, and NES cartridges and games to `nes`. Game entries can also provide a `gameId` and `gameTitle`; their source is a relative path inside this project, so it works when hosted under a GitHub Pages project path.

The shelf coordinate configuration is at the top of `app.js`; its 24 percentage pairs map to the 3:2 background scene from left to right and top to bottom. Adjust those values to line up covers with the shelf cubbies.

## Date availability and progress

`MVP_TEST_MODE` in `app.js` is enabled for local testing, so all 24 doors are available. Turn it off for production date locking: unopened doors become available on their day in December. Opened days are saved in this browser under the `christmasCalendarState` localStorage key. **Reset progress** clears that key.

Opening a door uses one reusable flow for zooming into its case, opening the front, removing the physical media, and presenting the matching TV or stereo view. VHS and NES share a TV startup sequence: off, static, test card, then selected content. Games load on demand in a sandboxed iframe clipped inside the CRT; closing the view unloads the game. Door 17 uses the self-contained Snake game in `games/snake/src/`, and door 18 uses Minesweeper in `games/minesweeper/`. Both games keep their MIT license with the source; Snake also includes the vendored TuiCss license. Minesweeper offers Beginner and Intermediate in the embedded view, fitting cell sizes to the available CRT area; Intermediate is hidden if the cells would be too small to use, and Expert is omitted from the embedded controls for readability. The static sound at `assets/sound/static.mp3` plays only with the static video. Escape or the visible Close button stops and resets playback and returns to the shelves.
