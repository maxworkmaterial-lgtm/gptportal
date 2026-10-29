#!/usr/bin/env bash
# Installs every skill, plugin and MCP server this project uses at user level,
# so they are available in any Claude Code chat on this machine.
# Usage (from the repo root): bash tools/skills/install.sh [--force]
#   --force  overwrite skills that already exist in ~/.claude/skills
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$HOME/.claude/skills"
FORCE="${1:-}"

command -v claude >/dev/null || { echo "claude CLI not found: install it first (curl -fsSL https://claude.ai/install.sh | bash)"; exit 1; }

echo "== 1. Skills from .claude/skills -> $DEST"
mkdir -p "$DEST"
for dir in "$ROOT"/.claude/skills/*/; do
  name="$(basename "$dir")"
  if [ -e "$DEST/$name" ] && [ "$FORCE" != "--force" ]; then
    echo "   skip  $name (already installed; --force to overwrite)"
  else
    rm -rf "$DEST/$name" && cp -R "$dir" "$DEST/$name" && echo "   ok    $name"
  fi
done

echo "== 2. Plugin marketplaces and plugins (user scope)"
# marketplace repo|plugin@marketplace
PLUGINS=(
  "earthtojake/text-to-cad|text-to-cad@earthtojake"
  "morluto/rea|rea@rea"
  "pixijs/pixijs-skills|pixijs-skills@pixijs-skills"
  "greensock/gsap-skills|gsap-skills@gsap-skills"
  "rig-c/core|rigc@rigc"
)
for entry in "${PLUGINS[@]}"; do
  repo="${entry%%|*}"; plugin="${entry##*|}"
  claude plugin marketplace add "$repo" >/dev/null 2>&1 || true
  if claude plugin install "$plugin" --scope user; then echo "   ok    $plugin"; else echo "   FAIL  $plugin"; fi
done

echo "== 3. MCP: Svelte docs"
claude mcp add --transport http --scope user svelte https://mcp.svelte.dev/mcp 2>/dev/null && echo "   ok    svelte" || echo "   skip  svelte (already added)"

echo "== 4. Phaser AE (opens the browser to sign in to phaser.io)"
if command -v node >/dev/null && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 20 ]; then
  npx -y @phaser-ae/cli setup || echo "   Phaser AE setup did not finish: run 'npx -y @phaser-ae/cli setup' again"
else
  echo "   skip  Node.js 20+ is required: brew install node, then: npx -y @phaser-ae/cli setup"
fi

echo
echo "Done. Restart Claude Code (or open a new chat) so the skills and plugins load."
