import { Action, List } from "@raycast/api";
import { run } from "./lib/omniwm";

type Item = { title: string; args: string[] };
type Group = { name: string; items: Item[] };

/**
 * Every entry shells out to `omniwmctl command <...>` (see `omniwmctl --help`).
 * Add/remove entries freely — each is just a title + the argv after `omniwmctl`.
 */
const GROUPS: Group[] = [
  {
    name: "Focus",
    items: [
      { title: "Focus Left", args: ["command", "focus", "left"] },
      { title: "Focus Right", args: ["command", "focus", "right"] },
      { title: "Focus Up", args: ["command", "focus", "up"] },
      { title: "Focus Down", args: ["command", "focus", "down"] },
      { title: "Focus Previous", args: ["command", "focus", "previous"] },
      { title: "Focus Column First", args: ["command", "focus-column", "first"] },
      { title: "Focus Column Last", args: ["command", "focus-column", "last"] },
    ],
  },
  {
    name: "Move & Resize",
    items: [
      { title: "Swap Split (swap the two panes)", args: ["command", "swap-split"] },
      { title: "Toggle Split", args: ["command", "toggle-split"] },
      { title: "Move Window Down", args: ["command", "move-window-down"] },
      { title: "Move Window Up", args: ["command", "move-window-up"] },
      { title: "Move Window Down or to Workspace Down", args: ["command", "move-window-down-or-to-workspace-down"] },
      { title: "Move Window Up or to Workspace Up", args: ["command", "move-window-up-or-to-workspace-up"] },
      { title: "Resize Grow (focused)", args: ["command", "resize-focused", "grow"] },
      { title: "Resize Shrink (focused)", args: ["command", "resize-focused", "shrink"] },
      { title: "Resize Horizontal Grow", args: ["command", "resize", "horizontal", "grow"] },
      { title: "Resize Horizontal Shrink", args: ["command", "resize", "horizontal", "shrink"] },
      { title: "Resize Vertical Grow", args: ["command", "resize", "vertical", "grow"] },
      { title: "Resize Vertical Shrink", args: ["command", "resize", "vertical", "shrink"] },
      { title: "Cycle Size Forward", args: ["command", "cycle-size", "forward"] },
      { title: "Cycle Size Backward", args: ["command", "cycle-size", "backward"] },
      { title: "Balance Sizes", args: ["command", "balance-sizes"] },
      { title: "Consume Window Left", args: ["command", "consume-or-expel-window-left"] },
      { title: "Consume Window Right", args: ["command", "consume-or-expel-window-right"] },
      { title: "Expel Window From Column", args: ["command", "expel-window-from-column"] },
      { title: "Toggle Column Tabbed", args: ["command", "toggle-column-tabbed"] },
    ],
  },
  {
    name: "Span (sizing)",
    items: [
      { title: "Cycle Primary Span Forward", args: ["command", "cycle-window-primary-span", "forward"] },
      { title: "Cycle Primary Span Backward", args: ["command", "cycle-window-primary-span", "backward"] },
      { title: "Cycle Secondary Span Forward", args: ["command", "cycle-window-secondary-span", "forward"] },
      { title: "Cycle Secondary Span Backward", args: ["command", "cycle-window-secondary-span", "backward"] },
      { title: "Reset Secondary Span", args: ["command", "reset-window-secondary-span"] },
      { title: "Expand To Available Primary Span", args: ["command", "expand-container-to-available-primary-span"] },
    ],
  },
  {
    name: "Windows",
    items: [
      { title: "Toggle Fullscreen", args: ["command", "toggle-fullscreen"] },
      { title: "Toggle Native Fullscreen", args: ["command", "toggle-native-fullscreen"] },
      { title: "Toggle Floating", args: ["command", "toggle-focused-window-floating"] },
      { title: "Close Focused Window", args: ["command", "close-focused-window"] },
      { title: "Move To Root", args: ["command", "move-to-root"] },
      { title: "Raise All Floating Windows", args: ["command", "raise-all-floating-windows"] },
      { title: "Rescue Offscreen Windows", args: ["command", "rescue-offscreen-windows"] },
    ],
  },
  {
    name: "Monitors",
    items: [
      { title: "Move To Monitor Left", args: ["command", "move-to-monitor", "left"] },
      { title: "Move To Monitor Right", args: ["command", "move-to-monitor", "right"] },
      { title: "Move To Monitor Up", args: ["command", "move-to-monitor", "up"] },
      { title: "Move To Monitor Down", args: ["command", "move-to-monitor", "down"] },
      { title: "Focus Monitor Next", args: ["command", "focus-monitor", "next"] },
      { title: "Focus Monitor Previous", args: ["command", "focus-monitor", "prev"] },
      { title: "Focus Monitor Last", args: ["command", "focus-monitor", "last"] },
    ],
  },
  {
    name: "Workspaces",
    items: [
      { title: "Next Workspace", args: ["command", "switch-workspace", "next"] },
      { title: "Previous Workspace", args: ["command", "switch-workspace", "prev"] },
      { title: "Back And Forth", args: ["command", "switch-workspace", "back-and-forth"] },
    ],
  },
  {
    name: "Layout & Views",
    items: [
      { title: "Toggle Overview", args: ["command", "toggle-overview"] },
      { title: "Toggle Workspace Bar", args: ["command", "toggle-workspace-bar"] },
      { title: "Toggle Quake Terminal", args: ["command", "toggle-quake-terminal"] },
      { title: "Toggle System Stats", args: ["command", "toggle-system-stats"] },
      { title: "Toggle Workspace Layout", args: ["command", "toggle-workspace-layout"] },
      { title: "Set Layout: Default", args: ["command", "set-workspace-layout", "default"] },
      { title: "Set Layout: Niri", args: ["command", "set-workspace-layout", "niri"] },
      { title: "Set Layout: Dwindle", args: ["command", "set-workspace-layout", "dwindle"] },
    ],
  },
  {
    name: "Scratchpad",
    items: [
      { title: "Toggle Scratchpad 1", args: ["command", "scratchpad", "toggle", "1"] },
      { title: "Assign Focused To Scratchpad 1", args: ["command", "scratchpad", "assign", "1"] },
      { title: "Toggle Scratchpad 2", args: ["command", "scratchpad", "toggle", "2"] },
      { title: "Assign Focused To Scratchpad 2", args: ["command", "scratchpad", "assign", "2"] },
    ],
  },
];

export default function Command() {
  return (
    <List>
      {GROUPS.map((group) => (
        <List.Section key={group.name} title={group.name}>
          {group.items.map((item) => (
            <List.Item
              key={item.title}
              title={item.title}
              subtitle={item.args.slice(1).join(" ")}
              actions={<Action title="Run" onAction={() => run(...item.args)} />}
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}