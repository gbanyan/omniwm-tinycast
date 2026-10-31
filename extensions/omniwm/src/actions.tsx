import { ReactElement } from "react";
import { Action, ActionPanel, List } from "@raycast/api";
import {
  MoveColumnToWorkspaceForm,
  MoveToWorkspaceOnMonitorForm,
  NumberCommandForm,
  OpenCommandPaletteModeForm,
  SizeChangeForm,
} from "./forms/command-forms";
import { ACTION_GROUPS, CatalogItem, PushTarget } from "./lib/actions-catalog";
import { run } from "./lib/omniwm";
import Marks from "./marks";
import Windows from "./windows";

function pushTarget(target: PushTarget): ReactElement {
  switch (target) {
    case "windows":
      return <Windows />;
    case "marks":
      return <Marks />;
    case "focus-column":
      return (
        <NumberCommandForm title="Focus Column" prefix={["command", "focus-column"]} fieldTitle="Column number" />
      );
    case "focus-window-in-column":
      return (
        <NumberCommandForm
          title="Focus Window In Column"
          prefix={["command", "focus-window-in-column"]}
          fieldTitle="Index"
        />
      );
    case "move-column-to-index":
      return (
        <NumberCommandForm
          title="Move Column To Index"
          prefix={["command", "move-column-to-index"]}
          fieldTitle="Index"
        />
      );
    case "move-column-to-workspace":
      return <MoveColumnToWorkspaceForm />;
    case "switch-workspace-anywhere":
      return (
        <NumberCommandForm
          title="Switch Workspace Anywhere"
          prefix={["command", "switch-workspace", "anywhere"]}
          fieldTitle="Workspace number"
        />
      );
    case "switch-workspace-slot":
      return (
        <NumberCommandForm
          title="Switch Workspace Slot"
          prefix={["command", "switch-workspace", "slot"]}
          fieldTitle="Slot"
        />
      );
    case "move-to-workspace-slot":
      return (
        <NumberCommandForm
          title="Move To Workspace Slot"
          prefix={["command", "move-to-workspace", "slot"]}
          fieldTitle="Slot"
        />
      );
    case "move-to-workspace-on-monitor":
      return <MoveToWorkspaceOnMonitorForm />;
    case "set-container-primary-span":
      return <SizeChangeForm title="Set Container Primary Span" prefix={["command", "set-container-primary-span"]} />;
    case "set-window-primary-span":
      return <SizeChangeForm title="Set Window Primary Span" prefix={["command", "set-window-primary-span"]} />;
    case "set-window-secondary-span":
      return <SizeChangeForm title="Set Window Secondary Span" prefix={["command", "set-window-secondary-span"]} />;
    case "scratchpad-toggle":
      return (
        <NumberCommandForm
          title="Toggle Scratchpad"
          prefix={["command", "scratchpad", "toggle"]}
          fieldTitle="Scratchpad number"
        />
      );
    case "scratchpad-assign":
      return (
        <NumberCommandForm
          title="Assign To Scratchpad"
          prefix={["command", "scratchpad", "assign"]}
          fieldTitle="Scratchpad number"
        />
      );
    case "open-command-palette-mode":
      return <OpenCommandPaletteModeForm />;
  }
}

function itemSubtitle(item: CatalogItem): string {
  if (item.kind === "run") return item.args.slice(1).join(" ");
  return item.subtitle ?? item.target;
}

function itemActions(item: CatalogItem) {
  if (item.kind === "run") {
    return (
      <ActionPanel>
        <Action title={item.title} onAction={() => run(...item.args)} />
      </ActionPanel>
    );
  }
  return (
    <ActionPanel>
      <Action.Push title={item.title} target={pushTarget(item.target)} />
    </ActionPanel>
  );
}

export default function Command() {
  return (
    <List searchBarPlaceholder="Filter OmniWM actions">
      {ACTION_GROUPS.map((group) => (
        <List.Section key={group.name} title={group.name}>
          {group.items.map((item) => (
            <List.Item
              key={`${group.name}:${item.title}`}
              title={item.title}
              subtitle={itemSubtitle(item)}
              keywords={item.keywords}
              actions={itemActions(item)}
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}
