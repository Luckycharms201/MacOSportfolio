# macOS Desktop Portfolio

A single-page portfolio styled as a macOS desktop — draggable project icons,
Finder-style marquee selection, a magnifying dock, and Preview-style windows.
Built with **Vite + React + Tailwind**. No drag libraries, no state libraries,
no `localStorage` — just React and native pointer events.

## Run

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # → static output in dist/
npm run preview  # serve the production build
```

> If you reinstall deps on this machine, the global npm config may require
> `npm install --ignore-scripts`.

## How it works

| Interaction | Behaviour |
|---|---|
| **Drag an icon** | Native pointer events; position lives in React state. Drag a multi-selection to move all at once. |
| **Single click** | Selects the icon (blue highlight behind thumbnail + label). |
| **Double click** | Opens the project window. |
| **Drag empty desktop** | Draws the translucent blue marquee; intersecting icons get selected. Click empty space to deselect. Hold **Shift** to add to a selection. |
| **Windows** | Multiple open at once, draggable by the title bar, click to bring to front, red light to close. Scale/fade in on open. |
| **Dock** | Translucent blur bar with cursor-tracking magnification. App tiles open their matching project. |

## Editing content

All projects live in [`src/data/projects.js`](src/data/projects.js) as a plain
array:

```js
{ id, title, app, thumbnail, images: [...], description }
```

Images are inline SVG placeholders so it runs with zero assets. To use real
images, drop files in `public/` and replace the `thumbnail` / `images[]`
strings with paths like `"/projects/reel-1.jpg"`. The `dockApps` array (same
file) controls the dock; set a tile's `projectId` to wire it to a window.

## Structure

```
src/
  main.jsx                 # React entry
  App.jsx                  # renders <Desktop/>
  constants.js             # icon dimensions
  data/projects.js         # projects, dock apps, background portrait
  components/
    Desktop.jsx            # main component: state, drag, marquee, windows
    DesktopIcon.jsx        # icon + caption + selection highlight
    Dock.jsx               # magnifying dock
    ProjectWindow.jsx      # macOS Preview-style window
```
