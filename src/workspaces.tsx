import { useEffect, useState } from "react";
import { Action, Icon, List, Spinner } from "@raycast/api";
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
        <List.Item icon={Icon.Window} />
        <Spinner />
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
    <List searchActionPlacement="always">
      {workspaces.map((w) => (
        <List.Item
          key={w.number}
          icon={w.isFocused ? Icon.CheckMarkCircleFill : Icon.Window}
          title={`${w.number} · ${w.displayName}`}
          subtitle={`${w.counts?.total ?? 0} window(s)${w.isFocused ? "  ·  focused" : ""}`}
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