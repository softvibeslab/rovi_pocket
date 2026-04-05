#!/usr/bin/env python3
"""Fetch Stitch project metadata and download screen assets.

This script talks directly to the Stitch MCP endpoint, exports metadata for a
project, and downloads available hosted files for selected screens by shelling
out to `curl -L` so redirects are followed consistently.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


STITCH_URL = "https://stitch.googleapis.com/mcp"


def call_tool(api_key: str, tool_name: str, arguments: dict[str, Any]) -> dict[str, Any]:
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {"name": tool_name, "arguments": arguments},
    }
    request = urllib.request.Request(
        STITCH_URL,
        method="POST",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        body = json.load(response)
    result = body.get("result", {})
    if result.get("isError"):
        text = ""
        content = result.get("content", [])
        if content and isinstance(content, list):
            first = content[0]
            if isinstance(first, dict):
                text = first.get("text", "")
        raise RuntimeError(f"{tool_name} failed: {text or json.dumps(result)}")
    return result


def normalize_suffix(mime_type: str | None, fallback: str) -> str:
    if mime_type == "text/html":
        return ".html"
    if mime_type == "text/markdown":
        return ".md"
    if mime_type:
        guessed = mimetypes.guess_extension(mime_type)
        if guessed:
            return guessed
    return fallback


def slugify(value: str) -> str:
    chars = []
    for ch in value.lower():
        if ch.isalnum():
            chars.append(ch)
        else:
            chars.append("-")
    slug = "".join(chars).strip("-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug or "item"


def write_json(path: Path, data: Any) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def download_with_curl(url: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["curl", "-L", "--fail", "--silent", "--show-error", url, "-o", str(destination)],
        check=True,
    )


def export_screen(api_key: str, project_id: str, screen_id: str, out_dir: Path, do_download: bool) -> dict[str, Any]:
    result = call_tool(
        api_key,
        "get_screen",
        {
            "name": f"projects/{project_id}/screens/{screen_id}",
            "projectId": project_id,
            "screenId": screen_id,
        },
    )
    screen = result.get("structuredContent", {})
    title = screen.get("title") or screen_id
    screen_dir = out_dir / "screens" / f"{screen_id}-{slugify(title)}"
    screen_dir.mkdir(parents=True, exist_ok=True)
    write_json(screen_dir / "screen.json", screen)

    downloads: list[dict[str, str]] = []
    for field, default_name, default_suffix in (
        ("htmlCode", "code", ".html"),
        ("screenshot", "screenshot", ".png"),
        ("figmaExport", "figma-export", ".fig"),
    ):
        file_info = screen.get(field, {}) or {}
        url = file_info.get("downloadUrl")
        if not url:
            continue
        mime_type = file_info.get("mimeType")
        suffix = normalize_suffix(mime_type, default_suffix)
        destination = screen_dir / f"{default_name}{suffix}"
        downloads.append(
            {
                "field": field,
                "url": url,
                "mimeType": mime_type or "",
                "path": str(destination),
                "fileName": file_info.get("name", ""),
            }
        )
        if do_download:
            download_with_curl(url, destination)

    return {
        "id": screen_id,
        "title": title,
        "name": screen.get("name", ""),
        "directory": str(screen_dir),
        "downloads": downloads,
    }


def export_design_systems(api_key: str, project_id: str, out_dir: Path) -> list[dict[str, Any]]:
    result = call_tool(api_key, "list_design_systems", {"projectId": project_id})
    systems = result.get("structuredContent", {}).get("designSystems", [])
    design_dir = out_dir / "design-systems"
    design_dir.mkdir(parents=True, exist_ok=True)
    exported: list[dict[str, Any]] = []
    for entry in systems:
        asset_name = entry.get("name", "assets/unknown")
        asset_id = asset_name.split("/")[-1]
        destination = design_dir / asset_id
        destination.mkdir(parents=True, exist_ok=True)
        write_json(destination / "design-system.json", entry)
        design_md = entry.get("designSystem", {}).get("theme", {}).get("designMd")
        if design_md:
            (destination / "design-system.md").write_text(design_md + "\n", encoding="utf-8")
        exported.append(
            {
                "assetId": asset_id,
                "name": asset_name,
                "directory": str(destination),
                "displayName": entry.get("designSystem", {}).get("displayName", ""),
            }
        )
    return exported


def main() -> int:
    parser = argparse.ArgumentParser(description="Export Stitch screens and assets.")
    parser.add_argument("--project-id", required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--screen-id", action="append", default=[])
    parser.add_argument("--skip-downloads", action="store_true")
    args = parser.parse_args()

    api_key = os.environ.get("STITCH_API_KEY")
    if not api_key:
        print("Missing STITCH_API_KEY environment variable.", file=sys.stderr)
        return 1

    out_dir = Path(args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    project_result = call_tool(api_key, "get_project", {"name": f"projects/{args.project_id}"})
    project = project_result.get("structuredContent", {})
    write_json(out_dir / "project.json", project)

    design_systems = export_design_systems(api_key, args.project_id, out_dir)

    screen_exports = []
    for screen_id in args.screen_id:
        screen_exports.append(
            export_screen(api_key, args.project_id, screen_id, out_dir, not args.skip_downloads)
        )

    manifest = {
        "projectId": args.project_id,
        "projectTitle": project.get("title", ""),
        "outputDirectory": str(out_dir),
        "screens": screen_exports,
        "designSystems": design_systems,
    }
    write_json(out_dir / "manifest.json", manifest)
    print(json.dumps(manifest, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except urllib.error.HTTPError as exc:
        print(f"HTTP error {exc.code}: {exc.read().decode('utf-8', 'replace')}", file=sys.stderr)
        raise
