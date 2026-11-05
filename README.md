# The Christmas Calendar

A static site built with HTML, CSS, vanilla JavaScript, and JSON. Publish this folder as the root of a GitHub Pages site; no build step or package installation is required. Because the calendar fetches `calendar.json`, preview it through a local web server rather than opening `index.html` directly as a `file://` URL.

Opening a door zooms into its doorway, swings the door open, and brings its content forward as a note. Click the open door or the surrounding scene to zoom back out; Escape and the close button also return to the calendar.

## Door content

Edit `calendar.json` to change the title, type, or content of a day. Keep one entry for each day from 1 through 24. Supported types:

- `message`: `content` displays plain text.
- `image`: `src` is an image path and `alt` describes the image; optional `content` adds a caption.
- `download`: `href` points to a file, normally under `downloads/`; `label` customizes the download link and `content` adds an introduction.
- `link`: `href` is a same-site or HTTPS link; `label` and `content` are optional.
- `embed`: `src` is an HTTPS or same-site URL shown in a sandboxed frame.
- `game` or `page`: `src` points to a custom HTML activity, for example `doors/day-01.html`.

Use paths relative to this project, such as `assets/winter.jpg`, `downloads/song.pdf`, and `doors/day-01.html`. Content is built with DOM text and attributes rather than interpreted as raw HTML.

## Progress and development

Opened days are stored in this browser/device under the single `christmasCalendarState` localStorage key as `{ "openedDoors": [1, 2] }`. To test the first-open flow again, use **Reset calendar**; this development-only control clears the saved key and resets the doors. Remove the button and its handler from `index.html` and `app.js` before release if you do not want it available to visitors.

Date locking is intentionally not active. Add the date check in `getDoorState(day)` in `app.js`, returning `locked` for unopened days that are not yet available and `available` for unlocked days. Opened days already return `opened`.
