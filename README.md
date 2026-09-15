# OmniWM (Raycast / tinycast extension)

A tiny extension that exposes your [OmniWM](https://github.com/) window-manager actions as a
filterable command palette. Type to narrow, hit **Enter** to run — each action shells out to
`omniwmctl` on your machine, so it works in **tinycast** (which runs real Raycast extensions) or in
Raycast itself.

## Commands

- **Actions** — a grouped, filterable menu of OmniWM commands: focus, move & resize (swap split,
  toggle split, resize, cycle size, balance), span sizing, windows (fullscreen, floating, close,
  root), monitors, workspace next/prev, layout & view toggles, and scratchpads.
- **Workspaces** — live list of your workspaces (queried from `omniwmctl`); pick one to **switch to**
  it or **move the focused window** there.

## Requirements

- OmniWM running with `omniwmctl` on disk (default: `/opt/homebrew/bin/omniwmctl`).
- Node.js (used to build/run the extension).

If `omniwmctl` lives elsewhere, set **Settings → OmniWM → omniwmctl path**.

## Run in Raycast (dev mode)

```sh
npm install
npm run dev        # `ray dev` — the extension appears in Raycast's palette live
```

## Run in tinycast

tinycast installs source Raycast extensions by running the build on your Mac (needs Node). Add this
repo to tinycast's extension list (from its URL / GitHub), or build here and import:

```sh
npm install
npm run build      # `ray build` → produces build/ that tinycast can import
```

## Extend

Every command is a one-line entry in `src/actions.tsx` (`{ title, args }` where `args` is the argv
after `omniwmctl`). The full surface is `omniwmctl --help`. `src/lib/omniwm.ts` has the `run()` /
`queryJson()` / `listWorkspaces()` helpers.

## Notes

- Read-only queries (`omniwmctl query …`) are safe; window-mutating commands affect your live
  layout, so they run only when you explicitly pick + Enter.
- Some subcommands take an argument that OmniWM interprets in a specific unit (e.g. span sizes); if
  an entry feels off, check `omniwmctl --help` and adjust the `args`.