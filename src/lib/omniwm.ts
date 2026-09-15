import { execFile, promisify } from "child_process";
import { preferences, showToast, Toast } from "@raycast/api";

const FALLBACK = "/opt/homebrew/bin/omniwmctl";
const execFileAsync = promisify(execFile);

const toNumber = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

/** Fire an omniwmctl command (fire-and-forget). Failures surface as a toast so a bad subcommand/arg is visible. */
export function run(...args: string[]): void {
  const bin = preferences.omniwmctlPath?.trim() || FALLBACK;
  execFile(bin, args, (err) => {
    if (!err) return;
    showToast({ style: Toast.Style.Failure, title: `omniwmctl ${args.join(" ")}`, message: String(err.message || err) });
  });
}

export interface Workspace {
  number: number;
  displayName: string;
  isFocused: boolean;
  counts?: { total?: number; tiled?: number; floating?: number; scratchpad?: number };
}

/** List workspaces (number, display name, focus, window counts) via `omniwmctl query workspaces`. */
export async function listWorkspaces(): Promise<Workspace[]> {
  const bin = preferences.omniwmctlPath?.trim() || FALLBACK;
  const { stdout } = await execFileAsync(bin, ["query", "workspaces", "--format", "json"], { maxBuffer: 16 * 1024 * 1024 });
  const data: unknown = JSON.parse(stdout);

  const payload =
    data !== null && typeof data === "object" && "result" in data
      ? (data as { result?: { payload?: { workspaces?: unknown[] } } }).result?.payload?.workspaces
      : undefined;
  const rows = Array.isArray(payload) ? payload : [];

  const out: Workspace[] = [];
  for (const row of rows) {
    if (row === null || typeof row !== "object") continue;
    const r = row as { number?: unknown; displayName?: unknown; isFocused?: unknown; counts?: unknown };
    const number = toNumber(r.number);
    const displayName = typeof r.displayName === "string" ? r.displayName : undefined;
    if (number === undefined || displayName === undefined) continue;

    const countsRaw = r.counts !== null && typeof r.counts === "object" ? (r.counts as Record<string, unknown>) : undefined;
    const counts =
      countsRaw !== undefined && toNumber(countsRaw["total"]) !== undefined
        ? {
            total: toNumber(countsRaw["total"]),
            tiled: toNumber(countsRaw["tiled"]),
            floating: toNumber(countsRaw["floating"]),
            scratchpad: toNumber(countsRaw["scratchpad"]),
          }
        : undefined;

    out.push({ number, displayName, isFocused: r.isFocused === true, counts });
  }
  return out;
}