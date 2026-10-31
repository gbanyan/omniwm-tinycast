import { useState } from "react";
import { Action, ActionPanel, Form } from "@raycast/api";
import { run } from "../lib/omniwm";

type NumberFormProps = {
  title: string;
  /** argv before the number */
  prefix: string[];
  /** argv after the number */
  suffix?: string[];
  fieldTitle?: string;
  defaultValue?: string;
};

export function NumberCommandForm({
  title,
  prefix,
  suffix = [],
  fieldTitle = "Number",
  defaultValue = "1",
}: NumberFormProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={title}
            onSubmit={() => {
              const n = value.trim();
              if (!n) return;
              run(...prefix, n, ...suffix);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="n" title={fieldTitle} value={value} onChange={setValue} />
    </Form>
  );
}

type SizeChangeFormProps = {
  title: string;
  prefix: string[];
};

/** size-change examples: `0.5`, `+0.1`, `-10`, `120`. */
export function SizeChangeForm({ title, prefix }: SizeChangeFormProps) {
  const [value, setValue] = useState("+0.1");
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={title}
            onSubmit={() => {
              const v = value.trim();
              if (!v) return;
              run(...prefix, v);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.Description text="Examples: 0.5, +0.1, -0.1, 120" />
      <Form.TextField id="size" title="Size change" value={value} onChange={setValue} />
    </Form>
  );
}

const DIRECTIONS = [
  { title: "Left", value: "left" },
  { title: "Right", value: "right" },
  { title: "Up", value: "up" },
  { title: "Down", value: "down" },
];

export function MoveColumnToWorkspaceForm() {
  const [mode, setMode] = useState<"number" | "up" | "down">("number");
  const [n, setN] = useState("1");
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Move Column To Workspace"
            onSubmit={() => {
              if (mode === "number") {
                const v = n.trim();
                if (!v) return;
                run("command", "move-column-to-workspace", v);
              } else {
                run("command", "move-column-to-workspace", mode);
              }
            }}
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="mode" title="Target" value={mode} onChange={(v) => setMode(v as typeof mode)}>
        <Form.Dropdown.Item title="Workspace number" value="number" />
        <Form.Dropdown.Item title="Up" value="up" />
        <Form.Dropdown.Item title="Down" value="down" />
      </Form.Dropdown>
      {mode === "number" ? <Form.TextField id="n" title="Workspace number" value={n} onChange={setN} /> : null}
    </Form>
  );
}

export function MoveToWorkspaceOnMonitorForm() {
  const [monitor, setMonitor] = useState("1");
  const [direction, setDirection] = useState("left");
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Move To Workspace On Monitor"
            onSubmit={() => {
              const m = monitor.trim();
              if (!m) return;
              run("command", "move-to-workspace", "on-monitor", m, direction);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="monitor" title="Monitor number" value={monitor} onChange={setMonitor} />
      <Form.Dropdown id="direction" title="Direction" value={direction} onChange={setDirection}>
        {DIRECTIONS.map((d) => (
          <Form.Dropdown.Item key={d.value} title={d.title} value={d.value} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}

const PALETTE_MODES = [
  { title: "Windows", value: "windows" },
  { title: "Menu", value: "menu" },
  { title: "Clipboard", value: "clipboard" },
  { title: "Commands", value: "commands" },
  { title: "Applications", value: "applications" },
  { title: "Files", value: "files" },
];

export function OpenCommandPaletteModeForm() {
  const [mode, setMode] = useState("windows");
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Open Command Palette"
            onSubmit={() => run("command", "open-command-palette", mode)}
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="mode" title="Mode" value={mode} onChange={setMode}>
        {PALETTE_MODES.map((m) => (
          <Form.Dropdown.Item key={m.value} title={m.title} value={m.value} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}

export function SetMarkForm() {
  const [name, setName] = useState("");
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Set Mark"
            onSubmit={() => {
              const n = name.trim();
              if (!n) return;
              run("window", "mark", "set", n);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Mark name" value={name} onChange={setName} />
    </Form>
  );
}

export function MoveWindowToWorkspaceForm({ windowId }: { windowId: string }) {
  const [n, setN] = useState("1");
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Move Window To Workspace"
            onSubmit={() => {
              const v = n.trim();
              if (!v) return;
              run("window", "move-to-workspace", windowId, v);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="n" title="Workspace number" value={n} onChange={setN} />
    </Form>
  );
}
