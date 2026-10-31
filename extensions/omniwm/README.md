# OmniWM (Raycast / tinycast extension)

Control [OmniWM](https://omnwm.dev) from the launcher via `omniwmctl`. Two palette
commands; everything else lives inside **Actions** (browse lists + Forms).

## Commands

- **Actions** — searchable catalog of OmniWM commands. **Enter** runs a fixed
  action and closes the palette. Rows ending in `…` push a nested screen:
  - **Browse Windows…** — live window list (focus / close / move-to-workspace)
  - **Window Marks…** — mark list (focus / summon / remove / set)
  - parameterized Forms (column index, workspace slot/anywhere, spans, scratchpad N, palette mode, …)
- **Workspaces** — live workspace list. **Enter** switches; ⌘K → *Move Focused
  Window Here*.

## tinycast compatibility

Requires **tinycast ≥ 0.11.3** (tested against **0.12.1**).

- `ActionPanel` + Enter → primary action are supported.
- `closeMainWindow` dismisses the palette after a successful `omniwmctl` run.
- Keep primary actions flat (not nested under `ActionPanel.Submenu`).
- Implicit ⌘↵ secondary action is a no-op on extension screens.

## Requirements

- OmniWM with `omniwmctl` on disk (default: `/opt/homebrew/bin/omniwmctl`).
- Node.js to build the extension.
- tinycast ≥ 0.11.3, or Raycast.

## Build / deploy

```sh
npm install
python3 generate-commands.py   # esbuild → prebuilt *.js + local tinycast install dir
# or: npm run build            # `ray build` for Raycast
```

`generate-commands.py` writes a 2-command `package.json`, bundles
`src/actions.tsx` and `src/workspaces.tsx` (nested Windows/Marks/Forms ride
inside the Actions bundle), publishes `actions.js` / `workspaces.js` next to
`package.json` for Tinycast Store / registry installs, and deploys to
`~/Library/Application Support/com.tinycast.app/extensions/omniwm`.

## Extend

- Fixed / push actions: edit [`src/lib/actions-catalog.ts`](src/lib/actions-catalog.ts),
  then map new `PushTarget`s in [`src/actions.tsx`](src/actions.tsx).
- Query helpers: [`src/lib/omniwm.ts`](src/lib/omniwm.ts).
- Forms: [`src/forms/command-forms.tsx`](src/forms/command-forms.tsx).
- Full surface: `omniwmctl --help`.

## Notes

- Mutating commands run only when you explicitly Enter / submit.
- `rule` / `subscribe` / `watch` / `capture` / generic query browsers are out of
  scope for this extension.
