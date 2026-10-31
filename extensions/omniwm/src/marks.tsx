import { useEffect, useState } from "react";
import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { SetMarkForm } from "./forms/command-forms";
import { listMarks, run, WindowMark } from "./lib/omniwm";

export default function Marks() {
  const [marks, setMarks] = useState<WindowMark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = () => {
    setLoading(true);
    setError(null);
    listMarks()
      .then(setMarks)
      .catch((e) => setError(String(e?.message || e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  if (loading) {
    return (
      <List navigationTitle="Window Marks">
        <List.Item icon={Icon.Tag} title="Loading marks…" />
      </List>
    );
  }

  if (error) {
    return (
      <List
        navigationTitle="Window Marks"
        actions={
          <ActionPanel>
            <Action title="Retry" onAction={reload} />
          </ActionPanel>
        }
      >
        <List.Item icon={Icon.ExclamationMark} title="Failed to list marks" subtitle={error} />
      </List>
    );
  }

  return (
    <List
      navigationTitle="Window Marks"
      searchBarPlaceholder="Filter marks"
      actions={
        <ActionPanel>
          <Action.Push title="Set Mark On Focused Window…" target={<SetMarkForm />} />
        </ActionPanel>
      }
    >
      {marks.length === 0 ? (
        <List.EmptyView
          title="No marks"
          description="Set a mark on the focused window"
          actions={
            <ActionPanel>
              <Action.Push title="Set Mark On Focused Window…" target={<SetMarkForm />} />
            </ActionPanel>
          }
        />
      ) : (
        marks.map((m) => (
          <List.Item
            key={m.name}
            icon={Icon.Tag}
            title={m.name}
            actions={
              <ActionPanel>
                <Action title="Focus Mark" onAction={() => run("window", "mark", "focus", m.name)} />
                <Action title="Summon Mark" onAction={() => run("window", "mark", "summon", m.name)} />
                <Action title="Remove Mark" onAction={() => run("window", "mark", "remove", m.name)} />
                <Action.Push title="Set Mark On Focused Window…" target={<SetMarkForm />} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
