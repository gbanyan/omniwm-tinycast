#!/usr/bin/env python3
"""Generate tinycast-compatible "just-run" OmniWM commands.

Each OmniWM action becomes its own Raycast/tinycast command (a tiny React
component whose useEffect fires `omniwmctl command ...` and then hide()s).
This is the only model tinycast's host executes on Enter — a `List` item's
onAction is never dispatched, and `noOutput` shell commands are rejected
(needs a built bundle).

Run:  python3 generate-commands.py
      (generates src/<slug>.tsx, builds dist/<slug>.js, rewrites package.json,
       and deploys bundles + package.json into the tinycast install dir)
"""
import json
import os
import shutil
import subprocess

REPO = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(REPO, "src")
DIST = os.path.join(REPO, "dist")
INSTALL = os.path.expanduser(
    "~/Library/Application Support/com.tinycast.app/extensions/omniwm"
)
BIN = "/opt/homebrew/bin/omniwmctl"

TEMPLATE = '''import {{ useEffect }} from "react";
import {{ List }} from "@raycast/api";
import {{ execFile }} from "child_process";

const BIN = "{bin}";

export default function Command() {{
  useEffect(() => {{
    execFile(BIN, {args}, {{ encoding: "utf-8" }}, () => {{}});
  }}, []);
  return (
    <List>
      <List.Item title={{"OmniWM: {title}"}} subtitle="running" />
    </List>
  );
}}
'''

# (slug, title, args-after-omniwmctl, extra-keywords)
ACTIONS = [
    ("focus-left", "Focus Left", ["command", "focus", "left"], ["focus", "left", "window"]),
    ("focus-right", "Focus Right", ["command", "focus", "right"], ["focus", "right", "window"]),
    ("focus-up", "Focus Up", ["command", "focus", "up"], ["focus", "up", "window"]),
    ("focus-down", "Focus Down", ["command", "focus", "down"], ["focus", "down", "window"]),
    ("focus-previous", "Focus Previous", ["command", "focus", "previous"], ["focus", "previous", "window"]),
    ("focus-column-first", "Focus Column First", ["command", "focus-column", "first"], ["focus", "column", "first"]),
    ("focus-column-last", "Focus Column Last", ["command", "focus-column", "last"], ["focus", "column", "last"]),
    ("swap-split", "Swap Split", ["command", "swap-split"], ["swap", "split", "panes"]),
    ("toggle-split", "Toggle Split", ["command", "toggle-split"], ["split"]),
    ("move-window-down", "Move Window Down", ["command", "move-window-down"], ["move", "window", "down"]),
    ("move-window-up", "Move Window Up", ["command", "move-window-up"], ["move", "window", "up"]),
    ("move-down-or-workspace", "Move Down or to Workspace Down", ["command", "move-window-down-or-to-workspace-down"], ["move", "down", "workspace"]),
    ("move-up-or-workspace", "Move Up or to Workspace Up", ["command", "move-window-up-or-to-workspace-up"], ["move", "up", "workspace"]),
    ("resize-focused-grow", "Resize Grow", ["command", "resize-focused", "grow"], ["resize", "grow"]),
    ("resize-focused-shrink", "Resize Shrink", ["command", "resize-focused", "shrink"], ["resize", "shrink"]),
    ("resize-h-grow", "Resize Horizontal Grow", ["command", "resize", "horizontal", "grow"], ["resize", "grow", "horizontal"]),
    ("resize-h-shrink", "Resize Horizontal Shrink", ["command", "resize", "horizontal", "shrink"], ["resize", "shrink", "horizontal"]),
    ("resize-v-grow", "Resize Vertical Grow", ["command", "resize", "vertical", "grow"], ["resize", "grow", "vertical"]),
    ("resize-v-shrink", "Resize Vertical Shrink", ["command", "resize", "vertical", "shrink"], ["resize", "shrink", "vertical"]),
    ("cycle-size-forward", "Cycle Size Forward", ["command", "cycle-size", "forward"], ["cycle", "size"]),
    ("cycle-size-backward", "Cycle Size Backward", ["command", "cycle-size", "backward"], ["cycle", "size"]),
    ("balance-sizes", "Balance Sizes", ["command", "balance-sizes"], ["balance", "size"]),
    ("consume-window-left", "Consume Window Left", ["command", "consume-or-expel-window-left"], ["consume", "left", "window"]),
    ("consume-window-right", "Consume Window Right", ["command", "consume-or-expel-window-right"], ["consume", "right", "window"]),
    ("expel-window-column", "Expel Window From Column", ["command", "expel-window-from-column"], ["expel", "column"]),
    ("toggle-column-tabbed", "Toggle Column Tabbed", ["command", "toggle-column-tabbed"], ["column", "tabbed"]),
    ("cycle-primary-span-fwd", "Cycle Primary Span Forward", ["command", "cycle-window-primary-span", "forward"], ["span", "primary"]),
    ("cycle-primary-span-bwd", "Cycle Primary Span Backward", ["command", "cycle-window-primary-span", "backward"], ["span", "primary"]),
    ("cycle-secondary-span-fwd", "Cycle Secondary Span Forward", ["command", "cycle-window-secondary-span", "forward"], ["span", "secondary"]),
    ("cycle-secondary-span-bwd", "Cycle Secondary Span Backward", ["command", "cycle-window-secondary-span", "backward"], ["span", "secondary"]),
    ("reset-secondary-span", "Reset Secondary Span", ["command", "reset-window-secondary-span"], ["span", "reset"]),
    ("expand-to-available-span", "Expand To Available Span", ["command", "expand-container-to-available-primary-span"], ["span", "expand"]),
    ("toggle-fullscreen", "Toggle Fullscreen", ["command", "toggle-fullscreen"], ["fullscreen"]),
    ("toggle-native-fullscreen", "Toggle Native Fullscreen", ["command", "toggle-native-fullscreen"], ["fullscreen", "native"]),
    ("toggle-floating", "Toggle Floating", ["command", "toggle-focused-window-floating"], ["floating", "float"]),
    ("close-window", "Close Focused Window", ["command", "close-focused-window"], ["close", "window"]),
    ("move-to-root", "Move To Root", ["command", "move-to-root"], ["root"]),
    ("raise-floating", "Raise All Floating Windows", ["command", "raise-all-floating-windows"], ["floating", "raise"]),
    ("rescue-offscreen", "Rescue Offscreen Windows", ["command", "rescue-offscreen-windows"], ["offscreen", "rescue"]),
    ("monitor-left", "Move To Monitor Left", ["command", "move-to-monitor", "left"], ["monitor", "left"]),
    ("monitor-right", "Move To Monitor Right", ["command", "move-to-monitor", "right"], ["monitor", "right"]),
    ("monitor-up", "Move To Monitor Up", ["command", "move-to-monitor", "up"], ["monitor", "up"]),
    ("monitor-down", "Move To Monitor Down", ["command", "move-to-monitor", "down"], ["monitor", "down"]),
    ("focus-monitor-next", "Focus Monitor Next", ["command", "focus-monitor", "next"], ["monitor", "next"]),
    ("focus-monitor-prev", "Focus Monitor Previous", ["command", "focus-monitor", "prev"], ["monitor", "prev"]),
    ("focus-monitor-last", "Focus Monitor Last", ["command", "focus-monitor", "last"], ["monitor", "last"]),
    ("workspace-next", "Next Workspace", ["command", "switch-workspace", "next"], ["workspace", "next"]),
    ("workspace-prev", "Previous Workspace", ["command", "switch-workspace", "prev"], ["workspace", "prev"]),
    ("workspace-back-forth", "Workspace Back and Forth", ["command", "switch-workspace", "back-and-forth"], ["workspace", "back", "forth"]),
    ("toggle-overview", "Toggle Overview", ["command", "toggle-overview"], ["overview"]),
    ("toggle-workspace-bar", "Toggle Workspace Bar", ["command", "toggle-workspace-bar"], ["workspace", "bar"]),
    ("toggle-quake", "Toggle Quake Terminal", ["command", "toggle-quake-terminal"], ["quake", "terminal"]),
    ("toggle-system-stats", "Toggle System Stats", ["command", "toggle-system-stats"], ["stats", "system"]),
    ("toggle-workspace-layout", "Toggle Workspace Layout", ["command", "toggle-workspace-layout"], ["layout", "workspace"]),
    ("set-layout-default", "Set Layout: Default", ["command", "set-workspace-layout", "default"], ["layout", "default"]),
    ("set-layout-niri", "Set Layout: Niri", ["command", "set-workspace-layout", "niri"], ["layout", "niri"]),
    ("set-layout-dwindle", "Set Layout: Dwindle", ["command", "set-workspace-layout", "dwindle"], ["layout", "dwindle"]),
    ("scratchpad-toggle-1", "Toggle Scratchpad 1", ["command", "scratchpad", "toggle", "1"], ["scratchpad", "1"]),
    ("scratchpad-assign-1", "Assign To Scratchpad 1", ["command", "scratchpad", "assign", "1"], ["scratchpad", "assign"]),
    ("scratchpad-toggle-2", "Toggle Scratchpad 2", ["command", "scratchpad", "toggle", "2"], ["scratchpad", "2"]),
    ("scratchpad-assign-2", "Assign To Scratchpad 2", ["command", "scratchpad", "assign", "2"], ["scratchpad", "assign"]),
]
# Direct jumps to a numbered workspace (user has 1..9).
for n in range(1, 10):
    ACTIONS.append((f"switch-to-workspace-{n}", f"Switch to Workspace {n}",
                    ["command", "switch-workspace", str(n)], ["workspace", str(n)]))


def build(slug, title, args):
    src_path = os.path.join(SRC, f"{slug}.tsx")
    with open(src_path, "w") as f:
        f.write(TEMPLATE.format(bin=BIN, args=json.dumps(args), title=title))
    out_path = os.path.join(DIST, f"{slug}.js")
    r = subprocess.run(
        ["npx", "esbuild", src_path, "--bundle", "--format=cjs", "--jsx=automatic",
         "--platform=node", "--target=es2022",
         "--external:@raycast/api", "--external:react", "--external:react/jsx-runtime",
         f"--outfile={out_path}"],
        cwd=REPO, capture_output=True, text=True,
    )
    if r.returncode != 0:
        raise SystemExit(f"esbuild failed for {slug}:\n{r.stderr}")
    return out_path


def main():
    os.makedirs(SRC, exist_ok=True)
    os.makedirs(DIST, exist_ok=True)
    # clear stale generated dist bundles (keep none; we rebuild all)
    for f in os.listdir(DIST):
        os.remove(os.path.join(DIST, f))

    commands = [
        {
            "name": "actions", "title": "Actions", "type": "script", "interpreter": "node",
            "script": "src/actions.tsx", "description": "Browse OmniWM actions (read-only in Tinycast)",
            "keywords": ["omniwm", "actions", "browse"],
        },
        {
            "name": "workspaces", "title": "Workspaces", "type": "script", "interpreter": "node",
            "script": "src/workspaces.tsx", "description": "Current OmniWM workspaces (read-only in Tinycast)",
            "keywords": ["omniwm", "workspace", "workspaces"],
        },
    ]
    for slug, title, args, kw in ACTIONS:
        build(slug, title, args)
        commands.append({
            "name": slug, "title": title, "type": "script", "interpreter": "node",
            "script": f"src/{slug}.tsx", "description": "OmniWM: " + title,
            "keywords": ["omniwm"] + kw,
        })

    pkg = {
        "$schema": "https://www.raycast.com/schemas/extension.json",
        "author": "gbanyan",
        "categories": ["Productivity", "System Tools"],
        "commands": commands,
        "dependencies": {"@raycast/api": "^1.83.0"},
        "description": "Control OmniWM (windows, workspaces, monitors) from Raycast or Tinycast.",
        "license": "MIT",
        "name": "omniwm",
    }
    with open(os.path.join(REPO, "package.json"), "w") as f:
        json.dump(pkg, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # deploy to the tinycast install dir
    os.makedirs(INSTALL, exist_ok=True)
    for f in os.listdir(DIST):
        shutil.copy2(os.path.join(DIST, f), os.path.join(INSTALL, f))
    shutil.copy2(os.path.join(REPO, "package.json"), os.path.join(INSTALL, "package.json"))
    # drop the selftest experiment
    for stale in ("selftest.js", "selftest.tsx"):
        p = os.path.join(INSTALL, stale)
        if os.path.exists(p):
            os.remove(p)

    print(f"generated {len(ACTIONS)} just-run commands + 2 lists = {len(commands)} total")
    print(f"deployed to {INSTALL}")


if __name__ == "__main__":
    main()