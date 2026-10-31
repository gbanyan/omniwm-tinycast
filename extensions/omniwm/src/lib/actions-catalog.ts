/** Single source of truth for the Actions command list. */

export type PushTarget =
  | "windows"
  | "marks"
  | "focus-column"
  | "focus-window-in-column"
  | "move-column-to-index"
  | "move-column-to-workspace"
  | "switch-workspace-anywhere"
  | "switch-workspace-slot"
  | "move-to-workspace-slot"
  | "move-to-workspace-on-monitor"
  | "set-container-primary-span"
  | "set-window-primary-span"
  | "set-window-secondary-span"
  | "scratchpad-toggle"
  | "scratchpad-assign"
  | "open-command-palette-mode";

export type CatalogItem =
  | { kind: "run"; title: string; args: string[]; keywords?: string[] }
  | { kind: "push"; title: string; target: PushTarget; subtitle?: string; keywords?: string[] };

export type CatalogGroup = { name: string; items: CatalogItem[] };

const run = (title: string, args: string[], keywords?: string[]): CatalogItem => ({
  kind: "run",
  title,
  args,
  keywords,
});

const push = (title: string, target: PushTarget, subtitle?: string, keywords?: string[]): CatalogItem => ({
  kind: "push",
  title,
  target,
  subtitle,
  keywords,
});

export const ACTION_GROUPS: CatalogGroup[] = [
  {
    name: "Browse",
    items: [
      push("Browse Windows…", "windows", "Focus / close / move a window", ["windows", "browse"]),
      push("Window Marks…", "marks", "Focus / summon / set marks", ["marks", "browse"]),
    ],
  },
  {
    name: "Focus",
    items: [
      run("Focus Left", ["command", "focus", "left"], ["focus", "left"]),
      run("Focus Right", ["command", "focus", "right"], ["focus", "right"]),
      run("Focus Up", ["command", "focus", "up"], ["focus", "up"]),
      run("Focus Down", ["command", "focus", "down"], ["focus", "down"]),
      run("Focus Previous", ["command", "focus", "previous"], ["focus", "previous"]),
      run("Focus Down or Left", ["command", "focus", "down-or-left"], ["focus"]),
      run("Focus Up or Right", ["command", "focus", "up-or-right"], ["focus"]),
      run("Focus Window Top", ["command", "focus-window", "top"], ["focus", "window"]),
      run("Focus Window Bottom", ["command", "focus-window", "bottom"], ["focus", "window"]),
      run("Focus Window Down or Top", ["command", "focus-window", "down-or-top"], ["focus", "window"]),
      run("Focus Window Up or Bottom", ["command", "focus-window", "up-or-bottom"], ["focus", "window"]),
      run("Focus Window or Workspace Down", ["command", "focus-window-or-workspace-down"], ["focus", "workspace"]),
      run("Focus Window or Workspace Up", ["command", "focus-window-or-workspace-up"], ["focus", "workspace"]),
      run("Focus Column First", ["command", "focus-column", "first"], ["focus", "column"]),
      run("Focus Column Last", ["command", "focus-column", "last"], ["focus", "column"]),
      push("Focus Column N…", "focus-column", "command focus-column <number>", ["focus", "column"]),
      push("Focus Window In Column N…", "focus-window-in-column", "command focus-window-in-column <number>", [
        "focus",
        "column",
      ]),
      run("Center Column", ["command", "center-column"], ["center", "column"]),
      run("Center Visible Columns", ["command", "center-visible-columns"], ["center", "column"]),
    ],
  },
  {
    name: "Move & Resize",
    items: [
      run("Move Left", ["command", "move", "left"], ["move"]),
      run("Move Right", ["command", "move", "right"], ["move"]),
      run("Move Up", ["command", "move", "up"], ["move"]),
      run("Move Down", ["command", "move", "down"], ["move"]),
      run("Swap Split", ["command", "swap-split"], ["swap", "split"]),
      run("Toggle Split", ["command", "toggle-split"], ["split"]),
      run("Move Window Down", ["command", "move-window-down"], ["move", "window"]),
      run("Move Window Up", ["command", "move-window-up"], ["move", "window"]),
      run("Move Window Down or to Workspace Down", ["command", "move-window-down-or-to-workspace-down"], [
        "move",
        "workspace",
      ]),
      run("Move Window Up or to Workspace Up", ["command", "move-window-up-or-to-workspace-up"], ["move", "workspace"]),
      run("Move Column Left", ["command", "move-column", "left"], ["move", "column"]),
      run("Move Column Right", ["command", "move-column", "right"], ["move", "column"]),
      run("Move Column Up", ["command", "move-column", "up"], ["move", "column"]),
      run("Move Column Down", ["command", "move-column", "down"], ["move", "column"]),
      run("Move Column To First", ["command", "move-column-to-first"], ["move", "column"]),
      run("Move Column To Last", ["command", "move-column-to-last"], ["move", "column"]),
      push("Move Column To Index…", "move-column-to-index", "command move-column-to-index <number>", ["move", "column"]),
      push("Move Column To Workspace…", "move-column-to-workspace", "number / up / down", ["move", "column", "workspace"]),
      run("Resize Grow (focused)", ["command", "resize-focused", "grow"], ["resize"]),
      run("Resize Shrink (focused)", ["command", "resize-focused", "shrink"], ["resize"]),
      run("Resize Horizontal Grow", ["command", "resize", "horizontal", "grow"], ["resize"]),
      run("Resize Horizontal Shrink", ["command", "resize", "horizontal", "shrink"], ["resize"]),
      run("Resize Vertical Grow", ["command", "resize", "vertical", "grow"], ["resize"]),
      run("Resize Vertical Shrink", ["command", "resize", "vertical", "shrink"], ["resize"]),
      run("Cycle Size Forward", ["command", "cycle-size", "forward"], ["cycle", "size"]),
      run("Cycle Size Backward", ["command", "cycle-size", "backward"], ["cycle", "size"]),
      run("Balance Sizes", ["command", "balance-sizes"], ["balance"]),
      run("Consume Window Left", ["command", "consume-or-expel-window-left"], ["consume"]),
      run("Consume Window Right", ["command", "consume-or-expel-window-right"], ["consume"]),
      run("Consume Window Into Column", ["command", "consume-window-into-column"], ["consume", "column"]),
      run("Expel Window From Column", ["command", "expel-window-from-column"], ["expel", "column"]),
      run("Toggle Column Tabbed", ["command", "toggle-column-tabbed"], ["column", "tabbed"]),
      run("Preselect Left", ["command", "preselect", "left"], ["preselect"]),
      run("Preselect Right", ["command", "preselect", "right"], ["preselect"]),
      run("Preselect Up", ["command", "preselect", "up"], ["preselect"]),
      run("Preselect Down", ["command", "preselect", "down"], ["preselect"]),
      run("Preselect Clear", ["command", "preselect", "clear"], ["preselect"]),
    ],
  },
  {
    name: "Span (sizing)",
    items: [
      run("Cycle Primary Span Forward", ["command", "cycle-window-primary-span", "forward"], ["span"]),
      run("Cycle Primary Span Backward", ["command", "cycle-window-primary-span", "backward"], ["span"]),
      run("Cycle Secondary Span Forward", ["command", "cycle-window-secondary-span", "forward"], ["span"]),
      run("Cycle Secondary Span Backward", ["command", "cycle-window-secondary-span", "backward"], ["span"]),
      run("Toggle Container Full Primary Span", ["command", "toggle-container-full-primary-span"], ["span"]),
      run("Expand To Available Primary Span", ["command", "expand-container-to-available-primary-span"], ["span"]),
      run("Reset Secondary Span", ["command", "reset-window-secondary-span"], ["span"]),
      push("Set Container Primary Span…", "set-container-primary-span", "size-change", ["span"]),
      push("Set Window Primary Span…", "set-window-primary-span", "size-change", ["span"]),
      push("Set Window Secondary Span…", "set-window-secondary-span", "size-change", ["span"]),
    ],
  },
  {
    name: "Windows",
    items: [
      run("Toggle Fullscreen", ["command", "toggle-fullscreen"], ["fullscreen"]),
      run("Toggle Native Fullscreen", ["command", "toggle-native-fullscreen"], ["fullscreen"]),
      run("Toggle Floating", ["command", "toggle-focused-window-floating"], ["floating"]),
      run("Toggle Floating Focus", ["command", "toggle-floating-focus"], ["floating"]),
      run("Close Focused Window", ["command", "close-focused-window"], ["close"]),
      run("Move To Root", ["command", "move-to-root"], ["root"]),
      run("Raise All Floating Windows", ["command", "raise-all-floating-windows"], ["floating"]),
      run("Rescue Offscreen Windows", ["command", "rescue-offscreen-windows"], ["offscreen"]),
    ],
  },
  {
    name: "Monitors",
    items: [
      run("Move To Monitor Left", ["command", "move-to-monitor", "left"], ["monitor"]),
      run("Move To Monitor Right", ["command", "move-to-monitor", "right"], ["monitor"]),
      run("Move To Monitor Up", ["command", "move-to-monitor", "up"], ["monitor"]),
      run("Move To Monitor Down", ["command", "move-to-monitor", "down"], ["monitor"]),
      run("Focus Monitor Next", ["command", "focus-monitor", "next"], ["monitor"]),
      run("Focus Monitor Previous", ["command", "focus-monitor", "prev"], ["monitor"]),
      run("Focus Monitor Last", ["command", "focus-monitor", "last"], ["monitor"]),
      run("Swap Workspace With Monitor Left", ["command", "swap-workspace-with-monitor", "left"], ["monitor", "workspace"]),
      run("Swap Workspace With Monitor Right", ["command", "swap-workspace-with-monitor", "right"], [
        "monitor",
        "workspace",
      ]),
      run("Swap Workspace With Monitor Up", ["command", "swap-workspace-with-monitor", "up"], ["monitor", "workspace"]),
      run("Swap Workspace With Monitor Down", ["command", "swap-workspace-with-monitor", "down"], ["monitor", "workspace"]),
    ],
  },
  {
    name: "Workspaces",
    items: [
      run("Next Workspace", ["command", "switch-workspace", "next"], ["workspace"]),
      run("Previous Workspace", ["command", "switch-workspace", "prev"], ["workspace"]),
      run("Back And Forth", ["command", "switch-workspace", "back-and-forth"], ["workspace"]),
      run("Move To Workspace Up", ["command", "move-to-workspace", "up"], ["workspace"]),
      run("Move To Workspace Down", ["command", "move-to-workspace", "down"], ["workspace"]),
      push("Switch Workspace Anywhere…", "switch-workspace-anywhere", "command switch-workspace anywhere <n>", [
        "workspace",
      ]),
      push("Switch Workspace Slot…", "switch-workspace-slot", "command switch-workspace slot <n>", ["workspace"]),
      push("Move To Workspace Slot…", "move-to-workspace-slot", "command move-to-workspace slot <n>", ["workspace"]),
      push("Move To Workspace On Monitor…", "move-to-workspace-on-monitor", "monitor number + direction", [
        "workspace",
        "monitor",
      ]),
    ],
  },
  {
    name: "Layout & Views",
    items: [
      run("Toggle Overview", ["command", "toggle-overview"], ["overview"]),
      run("Toggle Workspace Bar", ["command", "toggle-workspace-bar"], ["workspace", "bar"]),
      run("Hidden Bar Panel", ["command", "hidden-bar", "panel"], ["bar"]),
      run("Toggle Quake Terminal", ["command", "toggle-quake-terminal"], ["quake"]),
      run("Toggle System Stats", ["command", "toggle-system-stats"], ["stats"]),
      run("Toggle Workspace Layout", ["command", "toggle-workspace-layout"], ["layout"]),
      run("Set Layout: Default", ["command", "set-workspace-layout", "default"], ["layout"]),
      run("Set Layout: Niri", ["command", "set-workspace-layout", "niri"], ["layout"]),
      run("Set Layout: Dwindle", ["command", "set-workspace-layout", "dwindle"], ["layout"]),
      run("Open Command Palette", ["command", "open-command-palette"], ["palette"]),
      push("Open Command Palette Mode…", "open-command-palette-mode", "windows/menu/clipboard/…", ["palette"]),
      run("Open Menu Anywhere", ["command", "open-menu-anywhere"], ["menu"]),
    ],
  },
  {
    name: "Scratchpad",
    items: [
      run("Toggle Scratchpad 1", ["command", "scratchpad", "toggle", "1"], ["scratchpad"]),
      run("Assign Focused To Scratchpad 1", ["command", "scratchpad", "assign", "1"], ["scratchpad"]),
      run("Toggle Scratchpad 2", ["command", "scratchpad", "toggle", "2"], ["scratchpad"]),
      run("Assign Focused To Scratchpad 2", ["command", "scratchpad", "assign", "2"], ["scratchpad"]),
      push("Toggle Scratchpad N…", "scratchpad-toggle", "command scratchpad toggle <n>", ["scratchpad"]),
      push("Assign To Scratchpad N…", "scratchpad-assign", "command scratchpad assign <n>", ["scratchpad"]),
    ],
  },
];
