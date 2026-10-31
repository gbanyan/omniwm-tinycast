# omniwm-tinycast

A Raycast / [tinycast](https://github.com/abue-ammar/tinycast) extension to control
[OmniWM](https://omnwm.dev) from the launcher, driving it through the `omniwmctl` CLI.

This repository is a **Raycast-extension registry**: one directory per extension, laid out
like [`raycast/extensions`](https://github.com/raycast/extensions). tinycast reads a GitHub
registry at the `extensions/` path, so the extension lives at `extensions/omniwm/`.

- **`extensions/omniwm/`** — two palette commands: **Actions** (catalog + nested Windows /
  Marks / Forms) and **Workspaces** (live list). Requires tinycast ≥ 0.11.3. See
  `extensions/omniwm/README.md`.

## Install into tinycast

1. In tinycast, add a **GitHub registry** and paste
   `https://github.com/gbanyan/omniwm-tinycast`.
2. Install the **OmniWM** extension — tinycast builds it from source with Node (needs
   `npm`/`pnpm`/etc. installed).
3. For local iteration: `cd extensions/omniwm && python3 generate-commands.py` deploys
   bundles into tinycast’s install dir.

> The source is also mirrored on a private Gitea (`gbanyan/omniwm-tinycast`); this public
> GitHub repo is the tinycast registry mirror.
