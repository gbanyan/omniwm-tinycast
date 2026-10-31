#!/usr/bin/env python3
"""Build + deploy the OmniWM tinycast extension (Actions + Workspaces only).

Primary UX:
  - src/actions.tsx     — catalog + nested Windows/Marks/Forms (bundled together)
  - src/workspaces.tsx  — live workspace list

Writes prebuilt `actions.js` / `workspaces.js` next to package.json so the
GitHub registry ships without a toolchain (Tinycast Store requirement), then
also deploys into the local tinycast install dir.

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
BUNDLES = ("actions.js", "workspaces.js")

PACKAGE = {
    "$schema": "https://www.raycast.com/schemas/extension.json",
    "name": "omniwm",
    "title": "OmniWM",
    "description": "Control OmniWM (windows, workspaces, monitors) from Raycast or Tinycast.",
    "icon": "icon.svg",
    "author": "gbanyan",
    "license": "MIT",
    "platforms": ["macOS"],
    "categories": ["Productivity", "System Tools"],
    "commands": [
        {
            "name": "actions",
            "title": "Actions",
            "description": "Browse and run OmniWM actions (Enter runs; nested Windows/Marks/Forms)",
            "mode": "view",
            "keywords": ["omniwm", "actions", "window", "focus", "move"],
        },
        {
            "name": "workspaces",
            "title": "Workspaces",
            "description": "Switch workspace or move the focused window (Enter / ⌘K)",
            "mode": "view",
            "keywords": ["omniwm", "workspace", "workspaces"],
        },
    ],
    "dependencies": {"@raycast/api": "^1.83.0"},
}


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
    path = os.path.join(REPO, "package.json")
    with open(path, "w") as f:
        json.dump(PACKAGE, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return path


def publish_prebuilt():
    """Copy bundles next to package.json for Store / GitHub registry installs."""
    for name in BUNDLES:
        src = os.path.join(DIST, name)
        if not os.path.exists(src):
            raise SystemExit(f"missing build output: {src}")
        shutil.copy2(src, os.path.join(REPO, name))


def deploy():
    os.makedirs(INSTALL, exist_ok=True)
    for name in os.listdir(INSTALL):
        path = os.path.join(INSTALL, name)
        if os.path.isfile(path):
            os.remove(path)
    for name in BUNDLES:
        shutil.copy2(os.path.join(REPO, name), os.path.join(INSTALL, name))
    shutil.copy2(os.path.join(REPO, "package.json"), os.path.join(INSTALL, "package.json"))
    assets = os.path.join(REPO, "assets")
    if os.path.isdir(assets):
        dest = os.path.join(INSTALL, "assets")
        if os.path.isdir(dest):
            shutil.rmtree(dest)
        shutil.copytree(assets, dest)


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
    publish_prebuilt()
    deploy()

    print("built + published actions.js + workspaces.js (prebuilt for Store)")
    print(f"deployed to {INSTALL}")


if __name__ == "__main__":
    main()
