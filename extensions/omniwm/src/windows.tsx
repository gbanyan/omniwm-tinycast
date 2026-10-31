import { useEffect, useState } from "react";
import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { MoveWindowToWorkspaceForm } from "./forms/command-forms";
import { listWindows, OmniWindow, run } from "./lib/omniwm";

export default function Windows() {
  const [windows, setWindows] = useState<OmniWindow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listWindows()
      .then(setWindows)
      .catch((e) => setError(String(e?.message || e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <List navigationTitle="Windows">
        <List.Item icon={Icon.Window} title="Loading windows…" />
      </List>
    );
  }

  if (error) {
    return (
      <List navigationTitle="Windows">
        <List.Item icon={Icon.ExclamationMark} title="Failed to query windows" subtitle={error} />
      </List>
    );
  }

  if (windows.length === 0) {
    return (
      <List navigationTitle="Windows">
        <List.EmptyView title="No windows" />
      </List>
    );
  }

  return (
    <List navigationTitle="Windows" searchBarPlaceholder="Filter windows">
      {windows.map((w) => {
        const ws =
          w.workspaceNumber !== undefined
            ? `${w.workspaceNumber}${w.workspaceName ? ` · ${w.workspaceName}` : ""}`
            : w.workspaceName ?? "";
        const flags = [w.isFocused ? "focused" : null, w.isVisible ? "visible" : "hidden", w.mode]
          .filter(Boolean)
          .join(" · ");
        return (
          <List.Item
            key={w.id}
            icon={Icon.Window}
            title={`${w.appName} — ${w.title}`}
            subtitle={[ws, flags].filter(Boolean).join(" · ")}
            actions={
              <ActionPanel>
                <Action title="Focus Window" onAction={() => run("window", "focus", w.id)} />
                <Action title="Close Window" onAction={() => run("window", "close", w.id)} />
                <Action.Push
                  title="Move To Workspace…"
                  target={<MoveWindowToWorkspaceForm windowId={w.id} />}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
