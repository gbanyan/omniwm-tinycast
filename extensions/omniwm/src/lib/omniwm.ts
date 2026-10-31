import { execFile } from "child_process";
import { promisify } from "util";
import { closeMainWindow, preferences, showToast, Toast } from "@raycast/api";

const FALLBACK = "/opt/homebrew/bin/omniwmctl";
const execFileAsync = promisify(execFile);

const toNumber = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

// `preferences` is undefined in some host runtimes (e.g. Tinycast's @raycast/api shim), so
// guard the access and fall back to the known omniwmctl path when it isn't populated.
const binPath = (): string => {
  const pref = (preferences as unknown as { omniwmctlPath?: string } | undefined)?.omniwmctlPath;
  return (typeof pref === "string" && pref.trim()) || FALLBACK;
};

/**
 * Fire an omniwmctl command, then dismiss the palette.
 * Failures surface as a toast so a bad subcommand/arg is visible (palette stays open).
 */
export function run(...args: string[]): void {
  execFile(binPath(), args, (err) => {
    if (err) {
      showToast({
        style: Toast.Style.Failure,
        title: `omniwmctl ${args.join(" ")}`,
        message: String(err.message || err),
      });
      return;
    }
    void closeMainWindow({ clearRootSearch: true });
  });
}

export interface Workspace {
  number: number;
  displayName: string;
  isFocused: boolean;
  counts?: { total?: number; tiled?: number; floating?: number; scratchpad?: number };
}

export interface OmniWindow {
  id: string;
  title: string;
  appName: string;
  workspaceNumber?: number;
  workspaceName?: string;
  isFocused: boolean;
  isVisible: boolean;
  mode?: string;
}

export interface WindowMark {
  name: string;
}

function queryPayload<T>(data: unknown, key: string): T[] {
  if (data === null || typeof data !== "object" || !("result" in data)) return [];
  const result = (data as { result?: { payload?: Record<string, unknown> } }).result?.payload;
  const rows = result?.[key];
  return Array.isArray(rows) ? (rows as T[]) : [];
}

/** List workspaces (number, display name, focus, window counts) via `omniwmctl query workspaces`. */
export async function listWorkspaces(): Promise<Workspace[]> {
  const { stdout } = await execFileAsync(binPath(), ["query", "workspaces", "--format", "json"], {
    maxBuffer: 16 * 1024 * 1024,
  });
  const rows = queryPayload<Record<string, unknown>>(JSON.parse(stdout), "workspaces");

  const out: Workspace[] = [];
  for (const row of rows) {
    const number = toNumber(row.number);
    const displayName = typeof row.displayName === "string" ? row.displayName : undefined;
    if (number === undefined || displayName === undefined) continue;

    const countsRaw =
      row.counts !== null && typeof row.counts === "object" ? (row.counts as Record<string, unknown>) : undefined;
    const counts =
      countsRaw !== undefined && toNumber(countsRaw["total"]) !== undefined
        ? {
            total: toNumber(countsRaw["total"]),
            tiled: toNumber(countsRaw["tiled"]),
            floating: toNumber(countsRaw["floating"]),
            scratchpad: toNumber(countsRaw["scratchpad"]),
          }
        : undefined;

    out.push({ number, displayName, isFocused: row.isFocused === true, counts });
  }
  return out;
}

/** List windows via `omniwmctl query windows --format json`. */
export async function listWindows(): Promise<OmniWindow[]> {
  const { stdout } = await execFileAsync(binPath(), ["query", "windows", "--format", "json"], {
    maxBuffer: 16 * 1024 * 1024,
  });
  const rows = queryPayload<Record<string, unknown>>(JSON.parse(stdout), "windows");

  const out: OmniWindow[] = [];
  for (const row of rows) {
    const id = typeof row.id === "string" ? row.id : undefined;
    if (!id) continue;
    const app = row.app !== null && typeof row.app === "object" ? (row.app as Record<string, unknown>) : undefined;
    const workspace =
      row.workspace !== null && typeof row.workspace === "object"
        ? (row.workspace as Record<string, unknown>)
        : undefined;
    out.push({
      id,
      title: typeof row.title === "string" ? row.title : "(untitled)",
      appName: typeof app?.name === "string" ? app.name : "Unknown",
      workspaceNumber: toNumber(workspace?.number),
      workspaceName: typeof workspace?.displayName === "string" ? workspace.displayName : undefined,
      isFocused: row.isFocused === true,
      isVisible: row.isVisible === true,
      mode: typeof row.mode === "string" ? row.mode : undefined,
    });
  }
  return out;
}

/** List window marks via `omniwmctl window mark list --json`. */
export async function listMarks(): Promise<WindowMark[]> {
  const { stdout } = await execFileAsync(binPath(), ["window", "mark", "list", "--json"], {
    maxBuffer: 1 * 1024 * 1024,
  });
  const data: unknown = JSON.parse(stdout);
  const marks = queryPayload<unknown>(data, "marks");

  const out: WindowMark[] = [];
  for (const row of marks) {
    if (typeof row === "string") {
      out.push({ name: row });
      continue;
    }
    if (row !== null && typeof row === "object") {
      const r = row as Record<string, unknown>;
      const name = typeof r.name === "string" ? r.name : typeof r.mark === "string" ? r.mark : undefined;
      if (name) out.push({ name });
    }
  }
  return out;
}
