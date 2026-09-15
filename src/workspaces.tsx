import { useEffect, useState } from "react";
import { Action, Icon, List } from "@raycast/api";
import { listWorkspaces, run, Workspace } from "./lib/omniwm";

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listWorkspaces()
      .then(setWorkspaces)
      .catch((e) => setError(String(e?.message || e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <List>
        <List.Item icon={Icon.Window} title="Loading workspaces…" />
      </List>
    );
  }

  if (error) {
    return (
      <List>
        <List.Item icon={Icon.ExclamationMark} title="Failed to query OmniWM" subtitle={error} />
      </List>
    );
  }

  return (
    <List>
      {workspaces.map((w) => (
        <List.Item
          key={w.number}
          icon={Icon.Window}
          title={`${w.number} · ${w.displayName}${w.isFocused ? "  ✓ focused" : ""}`}
          subtitle={`${w.counts?.total ?? 0} window(s)`}
          actions={
            <>
              <Action title="Switch to This Workspace" onAction={() => run("command", "switch-workspace", String(w.number))} />
              <Action title="Move Focused Window Here" onAction={() => run("command", "move-to-workspace", String(w.number))} />
            </>
          }
        />
      ))}
    </List>
  );
}