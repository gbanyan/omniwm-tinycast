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

// src/workspaces.tsx
var workspaces_exports = {};
__export(workspaces_exports, {
  default: () => Workspaces
});
module.exports = __toCommonJS(workspaces_exports);
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
async function listWorkspaces() {
  const { stdout } = await execFileAsync(binPath(), ["query", "workspaces", "--format", "json"], {
    maxBuffer: 16 * 1024 * 1024
  });
  const rows = queryPayload(JSON.parse(stdout), "workspaces");
  const out = [];
  for (const row of rows) {
    const number = toNumber(row.number);
    const displayName = typeof row.displayName === "string" ? row.displayName : void 0;
    if (number === void 0 || displayName === void 0) continue;
    const countsRaw = row.counts !== null && typeof row.counts === "object" ? row.counts : void 0;
    const counts = countsRaw !== void 0 && toNumber(countsRaw["total"]) !== void 0 ? {
      total: toNumber(countsRaw["total"]),
      tiled: toNumber(countsRaw["tiled"]),
      floating: toNumber(countsRaw["floating"]),
      scratchpad: toNumber(countsRaw["scratchpad"])
    } : void 0;
    out.push({ number, displayName, isFocused: row.isFocused === true, counts });
  }
  return out;
}

// src/workspaces.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Workspaces() {
  const [workspaces, setWorkspaces] = (0, import_react.useState)([]);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    listWorkspaces().then(setWorkspaces).catch((e) => setError(String(e?.message || e))).finally(() => setLoading(false));
  }, []);
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.List, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.List.Item, { icon: import_api2.Icon.Window, title: "Loading workspaces\u2026" }) });
  }
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.List, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.List.Item, { icon: import_api2.Icon.ExclamationMark, title: "Failed to query OmniWM", subtitle: error }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.List, { children: workspaces.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_api2.List.Item,
    {
      icon: import_api2.Icon.Window,
      title: `${w.number} \xB7 ${w.displayName}${w.isFocused ? "  \u2713 focused" : ""}`,
      subtitle: `${w.counts?.total ?? 0} window(s)`,
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_api2.ActionPanel, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api2.Action,
          {
            title: "Switch to This Workspace",
            onAction: () => run("command", "switch-workspace", String(w.number))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api2.Action,
          {
            title: "Move Focused Window Here",
            onAction: () => run("command", "move-to-workspace", String(w.number))
          }
        )
      ] })
    },
    w.number
  )) });
}
