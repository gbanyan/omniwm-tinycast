import { useEffect } from "react";
import { List } from "@raycast/api";
import { execFile } from "child_process";

const BIN = "/opt/homebrew/bin/omniwmctl";

export default function Command() {
  useEffect(() => {
    execFile(BIN, ["command", "raise-all-floating-windows"], { encoding: "utf-8" }, () => {});
  }, []);
  return (
    <List>
      <List.Item title={"OmniWM: Raise All Floating Windows"} subtitle="running" />
    </List>
  );
}
