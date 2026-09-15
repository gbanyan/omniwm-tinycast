# omniwm-tinycast

A Raycast / [tinycast](https://github.com/abue-ammar/tinycast) extension to control
[OmniWM](https://omnwm.dev) from the launcher, driving it through the `omniwmctl` CLI.

This repository is a **Raycast-extension registry**: one directory per extension, laid out
like [`raycast/extensions`](https://github.com/raycast/extensions). tinycast reads a GitHub
registry at the `extensions/` path, so the extension lives at `extensions/omniwm/`.

- **`extensions/omniwm/`** — the OmniWM extension. Two palette commands:
  - **OmniWM Actions** — the `omniwmctl command …` surface (focus, move/resize, span,
    windows, monitors, workspaces, layout, scratchpads), filterable, Enter to run.
  - **OmniWM Workspaces** — live workspace list (number, name, focus, window counts) with
    *switch to* / *move focused window here*.

## Install into tinycast

1. In tinycast, add a **GitHub registry** and paste
   `https://github.com/gbanyan/omniwm-tinycast`.
2. Install the **OmniWM** extension — tinycast builds it from source with Node (needs
   `npm`/`pnpm`/etc. installed).
3. If your `omniwmctl` binary is not at `/opt/homebrew/bin/omniwmctl`, set the
   **omniwmctl path** setting to its absolute path.

> The source is also mirrored on a private Gitea (`gbanyan/omniwm-tinycast`); this public
> GitHub repo is the tinycast registry mirror.