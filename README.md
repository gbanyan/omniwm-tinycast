# omniwm-tinycast

**OmniWM** extension registry for **[Tinycast](https://github.com/abue-ammar/tinycast)** and **[Raycast](https://www.raycast.com)** — control the [OmniWM](https://omnwm.dev) macOS tiling window manager from your launcher via `omniwmctl`.

[![OmniWM](https://img.shields.io/badge/OmniWM-omnwm.dev-0a7ea4)](https://omnwm.dev)
[![Tinycast](https://img.shields.io/badge/Tinycast-extension-111111)](https://github.com/abue-ammar/tinycast)
[![Tinycast Store](https://img.shields.io/badge/Tinycast%20Store-listed-111111)](https://tinycast.store/)
[![Raycast](https://img.shields.io/badge/Raycast-compatible-FF6363)](https://www.raycast.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](extensions/omniwm/package.json)

This repository is a **Raycast-extension registry**: one directory per extension, laid out
like [`raycast/extensions`](https://github.com/raycast/extensions). Tinycast reads a GitHub
registry at the `extensions/` path, so the extension lives at `extensions/omniwm/`.

Tagged `tinycast-extension` / `tinycast-package` for the [Tinycast Store](https://tinycast.store/)
(refresh ~hourly). Prebuilt `actions.js` / `workspaces.js` ship in-tree so installs need no
toolchain; release zips are attached for folder import.

## Features

- **Actions** — searchable OmniWM command catalog (focus, move, resize, spans, monitors, layouts, scratchpads, …). Enter runs and closes the palette.
- **Nested browse** — Windows (focus / close / move) and Window Marks from Actions.
- **Forms** — parameterized commands (column index, workspace slot/anywhere, spans, scratchpad N, palette mode).
- **Workspaces** — live workspace list; Enter switches, ⌘K moves the focused window.
- Requires **Tinycast ≥ 0.11.3** (tested on 0.12.1) or Raycast.

See [`extensions/omniwm/README.md`](extensions/omniwm/README.md) for details.

## Install into Tinycast

**GitHub registry (recommended)**

1. Settings → Extensions → Registries → add `gbanyan/omniwm-tinycast`.
2. Install **OmniWM** (prebuilt bundles are committed; Node only needed if you rebuild).

**Folder / release zip**

1. Download the latest release zip from GitHub Releases.
2. Settings → Extensions → Add from folder → select the unzipped `omniwm` folder.

**Local rebuild**

```sh
cd extensions/omniwm && npm install && python3 generate-commands.py
```

> The source is also mirrored on a private Gitea; this public GitHub repo is the Tinycast
> registry mirror.
