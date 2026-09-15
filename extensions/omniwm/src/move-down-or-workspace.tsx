import { useEffect } from "react";
import { List } from "@raycast/api";
import { execFile } from "child_process";

const BIN = "/opt/homebrew/bin/omniwmctl";

export default function Command() {
  useEffect(() => {
    execFile(BIN, ["command", "move-window-down-or-to-workspace-down"], { encoding: "utf-8" }, () => {});
  }, []);
  return (
    <List>
      <List.Item title={"OmniWM: Move Down or to Workspace Down"} subtitle="running" />
    </List>
  );
}
