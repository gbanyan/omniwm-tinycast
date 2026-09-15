import { useEffect } from "react";
import { List } from "@raycast/api";
import { execFile } from "child_process";

const BIN = "/opt/homebrew/bin/omniwmctl";

export default function Command() {
  useEffect(() => {
    execFile(BIN, ["command", "set-workspace-layout", "dwindle"], { encoding: "utf-8" }, () => {});
  }, []);
  return (
    <List>
      <List.Item title={"OmniWM: Set Layout: Dwindle"} subtitle="running" />
    </List>
  );
}
