# omniwm-tinycast

**OmniWM** extension registry for **[Tinycast](https://github.com/abue-ammar/tinycast)** and **[Raycast](https://www.raycast.com)** — control the [OmniWM](https://omnwm.dev) macOS tiling window manager from your launcher via `omniwmctl`.

[![OmniWM](https://img.shields.io/badge/OmniWM-omnwm.dev-0a7ea4)](https://omnwm.dev)
[![Tinycast](https://img.shields.io/badge/Tinycast-extension-111111)](https://github.com/abue-ammar/tinycast)
[![Raycast](https://img.shields.io/badge/Raycast-compatible-FF6363)](https://www.raycast.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](extensions/omniwm/package.json)

This repository is a **Raycast-extension registry**: one directory per extension, laid out
like [`raycast/extensions`](https://github.com/raycast/extensions). Tinycast reads a GitHub
registry at the `extensions/` path, so the extension lives at `extensions/omniwm/`.

## Features

- **Actions** — searchable OmniWM command catalog (focus, move, resize, spans, monitors, layouts, scratchpads, …). Enter runs and closes the palette.
- **Nested browse** — Windows (focus / close / move) and Window Marks from Actions.
- **Forms** — parameterized commands (column index, workspace slot/anywhere, spans, scratchpad N, palette mode).
- **Workspaces** — live workspace list; Enter switches, ⌘K moves the focused window.
- Requires **Tinycast ≥ 0.11.3** (tested on 0.12.1) or Raycast.

See [`extensions/omniwm/README.md`](extensions/omniwm/README.md) for details.

## Install into Tinycast

1. In Tinycast, add a **GitHub registry** and paste
   `https://github.com/gbanyan/omniwm-tinycast`.
2. Install the **OmniWM** extension — Tinycast builds it from source with Node (needs
   `npm`/`pnpm`/etc. installed).
3. For local iteration: `cd extensions/omniwm && python3 generate-commands.py` deploys
   bundles into Tinycast’s install dir.

> The source is also mirrored on a private Gitea; this public GitHub repo is the Tinycast
> registry mirror.
