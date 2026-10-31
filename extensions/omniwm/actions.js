"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/actions.tsx
var actions_exports = {};
__export(actions_exports, {
  default: () => Command
});
module.exports = __toCommonJS(actions_exports);
var import_api5 = require("@raycast/api");

// src/forms/command-forms.tsx
var import_react = require("react");
var import_api2 = require("@raycast/api");

// src/lib/omniwm.ts
var import_child_process = require("child_process");
var import_util = require("util");
var import_api = require("@raycast/api");
var FALLBACK = "/opt/homebrew/bin/omniwmctl";
var execFileAsync = (0, import_util.promisify)(import_child_process.execFile);
var toNumber = (v) => typeof v === "number" && Number.isFinite(v) ? v : void 0;
var binPath = () => {
  const pref = import_api.preferences?.omniwmctlPath;
  return typeof pref === "string" && pref.trim() || FALLBACK;
};
function run(...args) {
  (0, import_child_process.execFile)(binPath(), args, (err) => {
    if (err) {
      (0, import_api.showToast)({
        style: import_api.Toast.Style.Failure,
        title: `omniwmctl ${args.join(" ")}`,
        message: String(err.message || err)
      });
      return;
    }
    void (0, import_api.closeMainWindow)({ clearRootSearch: true });
  });
}
function queryPayload(data, key) {
  if (data === null || typeof data !== "object" || !("result" in data)) return [];
  const result = data.result?.payload;
  const rows = result?.[key];
  return Array.isArray(rows) ? rows : [];
}
async function listWindows() {
  const { stdout } = await execFileAsync(binPath(), ["query", "windows", "--format", "json"], {
    maxBuffer: 16 * 1024 * 1024
  });
  const rows = queryPayload(JSON.parse(stdout), "windows");
  const out = [];
  for (const row of rows) {
    const id = typeof row.id === "string" ? row.id : void 0;
    if (!id) continue;
    const app = row.app !== null && typeof row.app === "object" ? row.app : void 0;
    const workspace = row.workspace !== null && typeof row.workspace === "object" ? row.workspace : void 0;
    out.push({
      id,
      title: typeof row.title === "string" ? row.title : "(untitled)",
      appName: typeof app?.name === "string" ? app.name : "Unknown",
      workspaceNumber: toNumber(workspace?.number),
      workspaceName: typeof workspace?.displayName === "string" ? workspace.displayName : void 0,
      isFocused: row.isFocused === true,
      isVisible: row.isVisible === true,
      mode: typeof row.mode === "string" ? row.mode : void 0
    });
  }
  return out;
}
async function listMarks() {
  const { stdout } = await execFileAsync(binPath(), ["window", "mark", "list", "--json"], {
    maxBuffer: 1 * 1024 * 1024
  });
  const data = JSON.parse(stdout);
  const marks = queryPayload(data, "marks");
  const out = [];
  for (const row of marks) {
    if (typeof row === "string") {
      out.push({ name: row });
      continue;
    }
    if (row !== null && typeof row === "object") {
      const r = row;
      const name = typeof r.name === "string" ? r.name : typeof r.mark === "string" ? r.mark : void 0;
      if (name) out.push({ name });
    }
  }
  return out;
}

// src/forms/command-forms.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function NumberCommandForm({
  title,
  prefix,
  suffix = [],
  fieldTitle = "Number",
  defaultValue = "1"
}) {
  const [value, setValue] = (0, import_react.useState)(defaultValue);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_api2.Form,
    {
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api2.Action.SubmitForm,
        {
          title,
          onSubmit: () => {
            const n = value.trim();
            if (!n) return;
            run(...prefix, n, ...suffix);
          }
        }
      ) }),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.TextField, { id: "n", title: fieldTitle, value, onChange: setValue })
    }
  );
}
function SizeChangeForm({ title, prefix }) {
  const [value, setValue] = (0, import_react.useState)("+0.1");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_api2.Form,
    {
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api2.Action.SubmitForm,
        {
          title,
          onSubmit: () => {
            const v = value.trim();
            if (!v) return;
            run(...prefix, v);
          }
        }
      ) }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Description, { text: "Examples: 0.5, +0.1, -0.1, 120" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.TextField, { id: "size", title: "Size change", value, onChange: setValue })
      ]
    }
  );
}
var DIRECTIONS = [
  { title: "Left", value: "left" },
  { title: "Right", value: "right" },
  { title: "Up", value: "up" },
  { title: "Down", value: "down" }
];
function MoveColumnToWorkspaceForm() {
  const [mode, setMode] = (0, import_react.useState)("number");
  const [n, setN] = (0, import_react.useState)("1");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_api2.Form,
    {
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api2.Action.SubmitForm,
        {
          title: "Move Column To Workspace",
          onSubmit: () => {
            if (mode === "number") {
              const v = n.trim();
              if (!v) return;
              run("command", "move-column-to-workspace", v);
            } else {
              run("command", "move-column-to-workspace", mode);
            }
          }
        }
      ) }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api2.Form.Dropdown, { id: "mode", title: "Target", value: mode, onChange: (v) => setMode(v), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Dropdown.Item, { title: "Workspace number", value: "number" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Dropdown.Item, { title: "Up", value: "up" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Dropdown.Item, { title: "Down", value: "down" })
        ] }),
        mode === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.TextField, { id: "n", title: "Workspace number", value: n, onChange: setN }) : null
      ]
    }
  );
}
function MoveToWorkspaceOnMonitorForm() {
  const [monitor, setMonitor] = (0, import_react.useState)("1");
  const [direction, setDirection] = (0, import_react.useState)("left");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_api2.Form,
    {
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api2.Action.SubmitForm,
        {
          title: "Move To Workspace On Monitor",
          onSubmit: () => {
            const m = monitor.trim();
            if (!m) return;
            run("command", "move-to-workspace", "on-monitor", m, direction);
          }
        }
      ) }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.TextField, { id: "monitor", title: "Monitor number", value: monitor, onChange: setMonitor }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Dropdown, { id: "direction", title: "Direction", value: direction, onChange: setDirection, children: DIRECTIONS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Dropdown.Item, { title: d.title, value: d.value }, d.value)) })
      ]
    }
  );
}
var PALETTE_MODES = [
  { title: "Windows", value: "windows" },
  { title: "Menu", value: "menu" },
  { title: "Clipboard", value: "clipboard" },
  { title: "Commands", value: "commands" },
  { title: "Applications", value: "applications" },
  { title: "Files", value: "files" }
];
function OpenCommandPaletteModeForm() {
  const [mode, setMode] = (0, import_react.useState)("windows");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_api2.Form,
    {
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api2.Action.SubmitForm,
        {
          title: "Open Command Palette",
          onSubmit: () => run("command", "open-command-palette", mode)
        }
      ) }),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Dropdown, { id: "mode", title: "Mode", value: mode, onChange: setMode, children: PALETTE_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Dropdown.Item, { title: m.title, value: m.value }, m.value)) })
    }
  );
}
function SetMarkForm() {
  const [name, setName] = (0, import_react.useState)("");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_api2.Form,
    {
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api2.Action.SubmitForm,
        {
          title: "Set Mark",
          onSubmit: () => {
            const n = name.trim();
            if (!n) return;
            run("window", "mark", "set", n);
          }
        }
      ) }),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.TextField, { id: "name", title: "Mark name", value: name, onChange: setName })
    }
  );
}
function MoveWindowToWorkspaceForm({ windowId }) {
  const [n, setN] = (0, import_react.useState)("1");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_api2.Form,
    {
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api2.Action.SubmitForm,
        {
          title: "Move Window To Workspace",
          onSubmit: () => {
            const v = n.trim();
            if (!v) return;
            run("window", "move-to-workspace", windowId, v);
          }
        }
      ) }),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.TextField, { id: "n", title: "Workspace number", value: n, onChange: setN })
    }
  );
}

// src/lib/actions-catalog.ts
var run2 = (title, args, keywords) => ({
  kind: "run",
  title,
  args,
  keywords
});
var push = (title, target, subtitle, keywords) => ({
  kind: "push",
  title,
  target,
  subtitle,
  keywords
});
var ACTION_GROUPS = [
  {
    name: "Browse",
    items: [
      push("Browse Windows\u2026", "windows", "Focus / close / move a window", ["windows", "browse"]),
      push("Window Marks\u2026", "marks", "Focus / summon / set marks", ["marks", "browse"])
    ]
  },
  {
    name: "Focus",
    items: [
      run2("Focus Left", ["command", "focus", "left"], ["focus", "left"]),
      run2("Focus Right", ["command", "focus", "right"], ["focus", "right"]),
      run2("Focus Up", ["command", "focus", "up"], ["focus", "up"]),
      run2("Focus Down", ["command", "focus", "down"], ["focus", "down"]),
      run2("Focus Previous", ["command", "focus", "previous"], ["focus", "previous"]),
      run2("Focus Down or Left", ["command", "focus", "down-or-left"], ["focus"]),
      run2("Focus Up or Right", ["command", "focus", "up-or-right"], ["focus"]),
      run2("Focus Window Top", ["command", "focus-window", "top"], ["focus", "window"]),
      run2("Focus Window Bottom", ["command", "focus-window", "bottom"], ["focus", "window"]),
      run2("Focus Window Down or Top", ["command", "focus-window", "down-or-top"], ["focus", "window"]),
      run2("Focus Window Up or Bottom", ["command", "focus-window", "up-or-bottom"], ["focus", "window"]),
      run2("Focus Window or Workspace Down", ["command", "focus-window-or-workspace-down"], ["focus", "workspace"]),
      run2("Focus Window or Workspace Up", ["command", "focus-window-or-workspace-up"], ["focus", "workspace"]),
      run2("Focus Column First", ["command", "focus-column", "first"], ["focus", "column"]),
      run2("Focus Column Last", ["command", "focus-column", "last"], ["focus", "column"]),
      push("Focus Column N\u2026", "focus-column", "command focus-column <number>", ["focus", "column"]),
      push("Focus Window In Column N\u2026", "focus-window-in-column", "command focus-window-in-column <number>", [
        "focus",
        "column"
      ]),
      run2("Center Column", ["command", "center-column"], ["center", "column"]),
      run2("Center Visible Columns", ["command", "center-visible-columns"], ["center", "column"])
    ]
  },
  {
    name: "Move & Resize",
    items: [
      run2("Move Left", ["command", "move", "left"], ["move"]),
      run2("Move Right", ["command", "move", "right"], ["move"]),
      run2("Move Up", ["command", "move", "up"], ["move"]),
      run2("Move Down", ["command", "move", "down"], ["move"]),
      run2("Swap Split", ["command", "swap-split"], ["swap", "split"]),
      run2("Toggle Split", ["command", "toggle-split"], ["split"]),
      run2("Move Window Down", ["command", "move-window-down"], ["move", "window"]),
      run2("Move Window Up", ["command", "move-window-up"], ["move", "window"]),
      run2("Move Window Down or to Workspace Down", ["command", "move-window-down-or-to-workspace-down"], [
        "move",
        "workspace"
      ]),
      run2("Move Window Up or to Workspace Up", ["command", "move-window-up-or-to-workspace-up"], ["move", "workspace"]),
      run2("Move Column Left", ["command", "move-column", "left"], ["move", "column"]),
      run2("Move Column Right", ["command", "move-column", "right"], ["move", "column"]),
      run2("Move Column Up", ["command", "move-column", "up"], ["move", "column"]),
      run2("Move Column Down", ["command", "move-column", "down"], ["move", "column"]),
      run2("Move Column To First", ["command", "move-column-to-first"], ["move", "column"]),
      run2("Move Column To Last", ["command", "move-column-to-last"], ["move", "column"]),
      push("Move Column To Index\u2026", "move-column-to-index", "command move-column-to-index <number>", ["move", "column"]),
      push("Move Column To Workspace\u2026", "move-column-to-workspace", "number / up / down", ["move", "column", "workspace"]),
      run2("Resize Grow (focused)", ["command", "resize-focused", "grow"], ["resize"]),
      run2("Resize Shrink (focused)", ["command", "resize-focused", "shrink"], ["resize"]),
      run2("Resize Horizontal Grow", ["command", "resize", "horizontal", "grow"], ["resize"]),
      run2("Resize Horizontal Shrink", ["command", "resize", "horizontal", "shrink"], ["resize"]),
      run2("Resize Vertical Grow", ["command", "resize", "vertical", "grow"], ["resize"]),
      run2("Resize Vertical Shrink", ["command", "resize", "vertical", "shrink"], ["resize"]),
      run2("Cycle Size Forward", ["command", "cycle-size", "forward"], ["cycle", "size"]),
      run2("Cycle Size Backward", ["command", "cycle-size", "backward"], ["cycle", "size"]),
      run2("Balance Sizes", ["command", "balance-sizes"], ["balance"]),
      run2("Consume Window Left", ["command", "consume-or-expel-window-left"], ["consume"]),
      run2("Consume Window Right", ["command", "consume-or-expel-window-right"], ["consume"]),
      run2("Consume Window Into Column", ["command", "consume-window-into-column"], ["consume", "column"]),
      run2("Expel Window From Column", ["command", "expel-window-from-column"], ["expel", "column"]),
      run2("Toggle Column Tabbed", ["command", "toggle-column-tabbed"], ["column", "tabbed"]),
      run2("Preselect Left", ["command", "preselect", "left"], ["preselect"]),
      run2("Preselect Right", ["command", "preselect", "right"], ["preselect"]),
      run2("Preselect Up", ["command", "preselect", "up"], ["preselect"]),
      run2("Preselect Down", ["command", "preselect", "down"], ["preselect"]),
      run2("Preselect Clear", ["command", "preselect", "clear"], ["preselect"])
    ]
  },
  {
    name: "Span (sizing)",
    items: [
      run2("Cycle Primary Span Forward", ["command", "cycle-window-primary-span", "forward"], ["span"]),
      run2("Cycle Primary Span Backward", ["command", "cycle-window-primary-span", "backward"], ["span"]),
      run2("Cycle Secondary Span Forward", ["command", "cycle-window-secondary-span", "forward"], ["span"]),
      run2("Cycle Secondary Span Backward", ["command", "cycle-window-secondary-span", "backward"], ["span"]),
      run2("Toggle Container Full Primary Span", ["command", "toggle-container-full-primary-span"], ["span"]),
      run2("Expand To Available Primary Span", ["command", "expand-container-to-available-primary-span"], ["span"]),
      run2("Reset Secondary Span", ["command", "reset-window-secondary-span"], ["span"]),
      push("Set Container Primary Span\u2026", "set-container-primary-span", "size-change", ["span"]),
      push("Set Window Primary Span\u2026", "set-window-primary-span", "size-change", ["span"]),
      push("Set Window Secondary Span\u2026", "set-window-secondary-span", "size-change", ["span"])
    ]
  },
  {
    name: "Windows",
    items: [
      run2("Toggle Fullscreen", ["command", "toggle-fullscreen"], ["fullscreen"]),
      run2("Toggle Native Fullscreen", ["command", "toggle-native-fullscreen"], ["fullscreen"]),
      run2("Toggle Floating", ["command", "toggle-focused-window-floating"], ["floating"]),
      run2("Toggle Floating Focus", ["command", "toggle-floating-focus"], ["floating"]),
      run2("Close Focused Window", ["command", "close-focused-window"], ["close"]),
      run2("Move To Root", ["command", "move-to-root"], ["root"]),
      run2("Raise All Floating Windows", ["command", "raise-all-floating-windows"], ["floating"]),
      run2("Rescue Offscreen Windows", ["command", "rescue-offscreen-windows"], ["offscreen"])
    ]
  },
  {
    name: "Monitors",
    items: [
      run2("Move To Monitor Left", ["command", "move-to-monitor", "left"], ["monitor"]),
      run2("Move To Monitor Right", ["command", "move-to-monitor", "right"], ["monitor"]),
      run2("Move To Monitor Up", ["command", "move-to-monitor", "up"], ["monitor"]),
      run2("Move To Monitor Down", ["command", "move-to-monitor", "down"], ["monitor"]),
      run2("Focus Monitor Next", ["command", "focus-monitor", "next"], ["monitor"]),
      run2("Focus Monitor Previous", ["command", "focus-monitor", "prev"], ["monitor"]),
      run2("Focus Monitor Last", ["command", "focus-monitor", "last"], ["monitor"]),
      run2("Swap Workspace With Monitor Left", ["command", "swap-workspace-with-monitor", "left"], ["monitor", "workspace"]),
      run2("Swap Workspace With Monitor Right", ["command", "swap-workspace-with-monitor", "right"], [
        "monitor",
        "workspace"
      ]),
      run2("Swap Workspace With Monitor Up", ["command", "swap-workspace-with-monitor", "up"], ["monitor", "workspace"]),
      run2("Swap Workspace With Monitor Down", ["command", "swap-workspace-with-monitor", "down"], ["monitor", "workspace"])
    ]
  },
  {
    name: "Workspaces",
    items: [
      run2("Next Workspace", ["command", "switch-workspace", "next"], ["workspace"]),
      run2("Previous Workspace", ["command", "switch-workspace", "prev"], ["workspace"]),
      run2("Back And Forth", ["command", "switch-workspace", "back-and-forth"], ["workspace"]),
      run2("Move To Workspace Up", ["command", "move-to-workspace", "up"], ["workspace"]),
      run2("Move To Workspace Down", ["command", "move-to-workspace", "down"], ["workspace"]),
      push("Switch Workspace Anywhere\u2026", "switch-workspace-anywhere", "command switch-workspace anywhere <n>", [
        "workspace"
      ]),
      push("Switch Workspace Slot\u2026", "switch-workspace-slot", "command switch-workspace slot <n>", ["workspace"]),
      push("Move To Workspace Slot\u2026", "move-to-workspace-slot", "command move-to-workspace slot <n>", ["workspace"]),
      push("Move To Workspace On Monitor\u2026", "move-to-workspace-on-monitor", "monitor number + direction", [
        "workspace",
        "monitor"
      ])
    ]
  },
  {
    name: "Layout & Views",
    items: [
      run2("Toggle Overview", ["command", "toggle-overview"], ["overview"]),
      run2("Toggle Workspace Bar", ["command", "toggle-workspace-bar"], ["workspace", "bar"]),
      run2("Hidden Bar Panel", ["command", "hidden-bar", "panel"], ["bar"]),
      run2("Toggle Quake Terminal", ["command", "toggle-quake-terminal"], ["quake"]),
      run2("Toggle System Stats", ["command", "toggle-system-stats"], ["stats"]),
      run2("Toggle Workspace Layout", ["command", "toggle-workspace-layout"], ["layout"]),
      run2("Set Layout: Default", ["command", "set-workspace-layout", "default"], ["layout"]),
      run2("Set Layout: Niri", ["command", "set-workspace-layout", "niri"], ["layout"]),
      run2("Set Layout: Dwindle", ["command", "set-workspace-layout", "dwindle"], ["layout"]),
      run2("Open Command Palette", ["command", "open-command-palette"], ["palette"]),
      push("Open Command Palette Mode\u2026", "open-command-palette-mode", "windows/menu/clipboard/\u2026", ["palette"]),
      run2("Open Menu Anywhere", ["command", "open-menu-anywhere"], ["menu"])
    ]
  },
  {
    name: "Scratchpad",
    items: [
      run2("Toggle Scratchpad 1", ["command", "scratchpad", "toggle", "1"], ["scratchpad"]),
      run2("Assign Focused To Scratchpad 1", ["command", "scratchpad", "assign", "1"], ["scratchpad"]),
      run2("Toggle Scratchpad 2", ["command", "scratchpad", "toggle", "2"], ["scratchpad"]),
      run2("Assign Focused To Scratchpad 2", ["command", "scratchpad", "assign", "2"], ["scratchpad"]),
      push("Toggle Scratchpad N\u2026", "scratchpad-toggle", "command scratchpad toggle <n>", ["scratchpad"]),
      push("Assign To Scratchpad N\u2026", "scratchpad-assign", "command scratchpad assign <n>", ["scratchpad"])
    ]
  }
];

// src/marks.tsx
var import_react2 = require("react");
var import_api3 = require("@raycast/api");
var import_jsx_runtime2 = require("react/jsx-runtime");
function Marks() {
  const [marks, setMarks] = (0, import_react2.useState)([]);
  const [loading, setLoading] = (0, import_react2.useState)(true);
  const [error, setError] = (0, import_react2.useState)(null);
  const reload = () => {
    setLoading(true);
    setError(null);
    listMarks().then(setMarks).catch((e) => setError(String(e?.message || e))).finally(() => setLoading(false));
  };
  (0, import_react2.useEffect)(() => {
    reload();
  }, []);
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.List, { navigationTitle: "Window Marks", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.List.Item, { icon: import_api3.Icon.Tag, title: "Loading marks\u2026" }) });
  }
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_api3.List,
      {
        navigationTitle: "Window Marks",
        actions: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.Action, { title: "Retry", onAction: reload }) }),
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.List.Item, { icon: import_api3.Icon.ExclamationMark, title: "Failed to list marks", subtitle: error })
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_api3.List,
    {
      navigationTitle: "Window Marks",
      searchBarPlaceholder: "Filter marks",
      actions: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.Action.Push, { title: "Set Mark On Focused Window\u2026", target: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SetMarkForm, {}) }) }),
      children: marks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        import_api3.List.EmptyView,
        {
          title: "No marks",
          description: "Set a mark on the focused window",
          actions: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.Action.Push, { title: "Set Mark On Focused Window\u2026", target: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SetMarkForm, {}) }) })
        }
      ) : marks.map((m) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        import_api3.List.Item,
        {
          icon: import_api3.Icon.Tag,
          title: m.name,
          actions: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_api3.ActionPanel, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.Action, { title: "Focus Mark", onAction: () => run("window", "mark", "focus", m.name) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.Action, { title: "Summon Mark", onAction: () => run("window", "mark", "summon", m.name) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.Action, { title: "Remove Mark", onAction: () => run("window", "mark", "remove", m.name) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.Action.Push, { title: "Set Mark On Focused Window\u2026", target: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SetMarkForm, {}) })
          ] })
        },
        m.name
      ))
    }
  );
}

// src/windows.tsx
var import_react3 = require("react");
var import_api4 = require("@raycast/api");
var import_jsx_runtime3 = require("react/jsx-runtime");
function Windows() {
  const [windows, setWindows] = (0, import_react3.useState)([]);
  const [loading, setLoading] = (0, import_react3.useState)(true);
  const [error, setError] = (0, import_react3.useState)(null);
  (0, import_react3.useEffect)(() => {
    listWindows().then(setWindows).catch((e) => setError(String(e?.message || e))).finally(() => setLoading(false));
  }, []);
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_api4.List, { navigationTitle: "Windows", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_api4.List.Item, { icon: import_api4.Icon.Window, title: "Loading windows\u2026" }) });
  }
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_api4.List, { navigationTitle: "Windows", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_api4.List.Item, { icon: import_api4.Icon.ExclamationMark, title: "Failed to query windows", subtitle: error }) });
  }
  if (windows.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_api4.List, { navigationTitle: "Windows", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_api4.List.EmptyView, { title: "No windows" }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_api4.List, { navigationTitle: "Windows", searchBarPlaceholder: "Filter windows", children: windows.map((w) => {
    const ws = w.workspaceNumber !== void 0 ? `${w.workspaceNumber}${w.workspaceName ? ` \xB7 ${w.workspaceName}` : ""}` : w.workspaceName ?? "";
    const flags = [w.isFocused ? "focused" : null, w.isVisible ? "visible" : "hidden", w.mode].filter(Boolean).join(" \xB7 ");
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_api4.List.Item,
      {
        icon: import_api4.Icon.Window,
        title: `${w.appName} \u2014 ${w.title}`,
        subtitle: [ws, flags].filter(Boolean).join(" \xB7 "),
        actions: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_api4.ActionPanel, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_api4.Action, { title: "Focus Window", onAction: () => run("window", "focus", w.id) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_api4.Action, { title: "Close Window", onAction: () => run("window", "close", w.id) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            import_api4.Action.Push,
            {
              title: "Move To Workspace\u2026",
              target: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MoveWindowToWorkspaceForm, { windowId: w.id })
            }
          )
        ] })
      },
      w.id
    );
  }) });
}

// src/actions.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function pushTarget(target) {
  switch (target) {
    case "windows":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Windows, {});
    case "marks":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Marks, {});
    case "focus-column":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(NumberCommandForm, { title: "Focus Column", prefix: ["command", "focus-column"], fieldTitle: "Column number" });
    case "focus-window-in-column":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        NumberCommandForm,
        {
          title: "Focus Window In Column",
          prefix: ["command", "focus-window-in-column"],
          fieldTitle: "Index"
        }
      );
    case "move-column-to-index":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        NumberCommandForm,
        {
          title: "Move Column To Index",
          prefix: ["command", "move-column-to-index"],
          fieldTitle: "Index"
        }
      );
    case "move-column-to-workspace":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(MoveColumnToWorkspaceForm, {});
    case "switch-workspace-anywhere":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        NumberCommandForm,
        {
          title: "Switch Workspace Anywhere",
          prefix: ["command", "switch-workspace", "anywhere"],
          fieldTitle: "Workspace number"
        }
      );
    case "switch-workspace-slot":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        NumberCommandForm,
        {
          title: "Switch Workspace Slot",
          prefix: ["command", "switch-workspace", "slot"],
          fieldTitle: "Slot"
        }
      );
    case "move-to-workspace-slot":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        NumberCommandForm,
        {
          title: "Move To Workspace Slot",
          prefix: ["command", "move-to-workspace", "slot"],
          fieldTitle: "Slot"
        }
      );
    case "move-to-workspace-on-monitor":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(MoveToWorkspaceOnMonitorForm, {});
    case "set-container-primary-span":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SizeChangeForm, { title: "Set Container Primary Span", prefix: ["command", "set-container-primary-span"] });
    case "set-window-primary-span":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SizeChangeForm, { title: "Set Window Primary Span", prefix: ["command", "set-window-primary-span"] });
    case "set-window-secondary-span":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SizeChangeForm, { title: "Set Window Secondary Span", prefix: ["command", "set-window-secondary-span"] });
    case "scratchpad-toggle":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        NumberCommandForm,
        {
          title: "Toggle Scratchpad",
          prefix: ["command", "scratchpad", "toggle"],
          fieldTitle: "Scratchpad number"
        }
      );
    case "scratchpad-assign":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        NumberCommandForm,
        {
          title: "Assign To Scratchpad",
          prefix: ["command", "scratchpad", "assign"],
          fieldTitle: "Scratchpad number"
        }
      );
    case "open-command-palette-mode":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(OpenCommandPaletteModeForm, {});
  }
}
function itemSubtitle(item) {
  if (item.kind === "run") return item.args.slice(1).join(" ");
  return item.subtitle ?? item.target;
}
function itemActions(item) {
  if (item.kind === "run") {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_api5.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_api5.Action, { title: item.title, onAction: () => run(...item.args) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_api5.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_api5.Action.Push, { title: item.title, target: pushTarget(item.target) }) });
}
function Command() {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_api5.List, { searchBarPlaceholder: "Filter OmniWM actions", children: ACTION_GROUPS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_api5.List.Section, { title: group.name, children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_api5.List.Item,
    {
      title: item.title,
      subtitle: itemSubtitle(item),
      keywords: item.keywords,
      actions: itemActions(item)
    },
    `${group.name}:${item.title}`
  )) }, group.name)) });
}
