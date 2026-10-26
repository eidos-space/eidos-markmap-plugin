# Markmap Mindmap Plugin for Eidos Lite

An interactive Markdown mindmap visualization plugin for Eidos Lite, powered by [markmap-lib](https://markmap.js.org/) and [markmap-view](https://markmap.js.org/).

Requires Eidos Lite 0.29.0 or later and Plugin API 3.7.0. Labels and documentation follow the host language; changing language preserves folded branches and canvas position.

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

1. Download `eidos.markmap-0.4.0.eidos-plugin` from [GitHub Releases](https://github.com/eidos-space/eidos-markmap-plugin/releases), or build it with `npm run build`.
2. In Eidos Lite, open **Plugins → Install plugin…** and select the package. Enable Markmap in your Space.
3. Open a Markdown file and select **Markmap** in the editor view switcher.

CLI Serve and current mobile hosts do not support this API 3.7 archive.

## Development

```bash
# Install dependencies
npm ci

# Build the distributable .eidos-plugin package
npm run build
```
