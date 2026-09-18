# Markmap Mindmap Plugin for Eidos Lite

An interactive Markdown mindmap visualization plugin for Eidos Lite, powered by [markmap-lib](https://markmap.js.org/) and [markmap-view](https://markmap.js.org/).

## Features

- **Interactive Mindmap**: Transforms headings (`# Heading`) and bullet lists (`- item`) into dynamic, collapsible tree graphs.
- **Real-time Synchronization**: Observes document changes via Eidos Lite's `TextDocument` working copy. Updates mindmap branches in real-time as you write or edit.
- **Interactive Controls**:
  - **Fit**: Centers and fits the entire mindmap to the view.
  - **Zoom (+ / -)**: Smoothly zooms into or out of branches.
  - **Expand / Collapse**: One-click to expand all or fold to root/subheadings.
  - **Pan & Drag**: Canvas can be dragged smoothly in any direction.
  - **Fold/Unfold Nodes**: Click any branch circle to fold or expand child nodes.
- **Eidos Theme Integration**: Dynamically reacts to Eidos Lite light and dark themes using semantic tokens (`--eidos-background`, `--eidos-foreground`, `--eidos-accent`, etc.).
- **Self-contained & Offline-first**: Bundled into a zero-dependency `.eidos-plugin` conforming to Eidos Lite's sandboxed iframe security policies.

## Usage in Eidos Lite

### Method 1: Load Development Source (Hot-reloading)
1. Open **Eidos Lite**.
2. Go to **Settings** > **Plugins** (or File editor plugins).
3. Click **Load development source** and select this directory or `plugin.json`.
4. Open any `.md` or `.markdown` file in your Space.
5. In the top editor view switcher, select **Markmap**.

### Method 2: Use the Prebuilt `.eidos-plugin` Package
1. Build the package:
   ```bash
   npm run build
   ```
2. The packaged plugin is generated at `dist/eidos.markmap-0.1.0.eidos-plugin`.
3. Drag and drop the `.eidos-plugin` file into Eidos Lite or place it in your Space's plugin registry.

## Development

```bash
# Install dependencies
npm install

# Build the distributable .eidos-plugin package
npm run build
```
