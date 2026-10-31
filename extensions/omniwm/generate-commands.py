#!/usr/bin/env python3
"""Build + deploy the OmniWM tinycast extension (Actions + Workspaces only).

Primary UX:
  - src/actions.tsx     — catalog + nested Windows/Marks/Forms (bundled together)
  - src/workspaces.tsx  — live workspace list

Tinycast loads extensions/omniwm/<command-name>.js by name, so this script
esbuilds those two entrypoints and copies them (plus a 2-command package.json)
into the tinycast install dir. Just-run per-action commands are no longer
registered or generated.

Run:  python3 generate-commands.py
"""
import json
import os
import shutil
import subprocess

REPO = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(REPO, "src")
DIST = os.path.join(REPO, "dist")
INSTALL = os.path.expanduser(
    "~/Library/Application Support/com.tinycast.app/extensions/omniwm"
)

ENTRYPOINTS = [
    os.path.join(SRC, "actions.tsx"),
    os.path.join(SRC, "workspaces.tsx"),
]


def esbuild(*src_paths):
    r = subprocess.run(
        [
            "npx", "esbuild", *src_paths,
            "--bundle", "--format=cjs", "--jsx=automatic",
            "--platform=node", "--target=es2022",
            "--external:@raycast/api", "--external:react", "--external:react/jsx-runtime",
            f"--outdir={DIST}",
        ],
        cwd=REPO, capture_output=True, text=True,
    )
    if r.returncode != 0:
        raise SystemExit(f"esbuild failed:\n{r.stderr}")


def purge_just_run_sources():
    """Remove leftover generated just-run command files from earlier layouts."""
    keep = {
        "actions.tsx",
        "workspaces.tsx",
        "windows.tsx",
        "marks.tsx",
        "lib",
        "forms",
    }
    for name in os.listdir(SRC):
        if name in keep:
            continue
        path = os.path.join(SRC, name)
        if os.path.isfile(path) and name.endswith((".tsx", ".ts", ".js")):
            os.remove(path)


def write_package():
    pkg = {
        "$schema": "https://www.raycast.com/schemas/extension.json",
        "author": "gbanyan",
        "categories": ["Productivity", "System Tools"],
        "commands": [
            {
                "name": "actions",
                "title": "Actions",
                "description": "Browse and run OmniWM actions (Enter runs; nested Windows/Marks/Forms)",
                "mode": "view",
            },
            {
                "name": "workspaces",
                "title": "Workspaces",
                "description": "Switch workspace or move the focused window (Enter / ⌘K)",
                "mode": "view",
            },
        ],
        "dependencies": {"@raycast/api": "^1.83.0"},
        "description": "Control OmniWM (windows, workspaces, monitors) from Raycast or Tinycast.",
        "license": "MIT",
        "name": "omniwm",
    }
    path = os.path.join(REPO, "package.json")
    with open(path, "w") as f:
        json.dump(pkg, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return path


def deploy():
    os.makedirs(INSTALL, exist_ok=True)
    # Clear previous just-run / stale bundles so tinycast cannot pick them up.
    for name in os.listdir(INSTALL):
        path = os.path.join(INSTALL, name)
        if os.path.isfile(path):
            os.remove(path)
    for name in ("actions.js", "workspaces.js"):
        src = os.path.join(DIST, name)
        if not os.path.exists(src):
            raise SystemExit(f"missing build output: {src}")
        shutil.copy2(src, os.path.join(INSTALL, name))
    shutil.copy2(os.path.join(REPO, "package.json"), os.path.join(INSTALL, "package.json"))


def main():
    for p in ENTRYPOINTS:
        if not os.path.exists(p):
            raise SystemExit(f"missing entrypoint: {p}")

    os.makedirs(DIST, exist_ok=True)
    for f in os.listdir(DIST):
        os.remove(os.path.join(DIST, f))

    purge_just_run_sources()
    esbuild(*ENTRYPOINTS)
    write_package()
    deploy()

    print("built actions.js + workspaces.js (2 palette commands)")
    print(f"deployed to {INSTALL}")


if __name__ == "__main__":
    main()
