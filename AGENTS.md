# Agent guidance for this repo

This workspace has two parallel tracks for turning Figma exports into code:

1. **Polaris React page** (`WorkflowsPage.tsx`) — hand-assembled `.tsx` using `@shopify/polaris`.
2. **Generic HTML/CSS parser** (`parser/`, planned) — recursive walker that emits `output.html` from `design/data.json`.

See `figma_json_to_html_css_parser_b62a3654.plan.md` for the full plan.

## Active Cursor configuration

| Artifact | Path | Purpose |
|---|---|---|
| Rule | `.cursor/rules/figma-to-polaris.mdc` | Component mapping + deprecated-import list for `.tsx` files |
| Rule | `.cursor/rules/figma-data-reading.mdc` | How to read large Figma exports in `design/` |
| Skill | `.cursor/skills/figma-to-polaris/SKILL.md` | 6-step workflow to turn a Figma frame into a Polaris page |
| Hook | `.cursor/hooks/check-polaris-imports.sh` (afterFileEdit) | Flags deprecated Polaris components on `.tsx` edits |
| Hook | `.cursor/hooks/guard-large-json.sh` (beforeReadFile) | Nudges use of Grep/offset when reading `design/data.json` |

## Subagent delegation (built-in types only)

Cursor does **not** support user-defined subagent types. Use these built-in types when delegating:

| Task | Subagent | Example |
|---|---|---|
| Explore an unfamiliar Figma JSON (find nodes, count types, trace tokens) | `explore` with `thoroughness: "medium"` | "Find every TEXT node whose parent is a Card and list their characters" |
| Autonomous multi-step translation of a screen | `generalPurpose` | "Read design/data.json + PNG, emit a new .tsx matching the figma-to-polaris skill" |
| Run commands (install, lint, build) | `shell` | "Run npm install + tsc --noEmit" |
| Best-of-N attempts on a tricky translation | `best-of-n-runner` | "Produce 3 Polaris layouts for this frame in parallel worktrees" |

Always reference the `figma-to-polaris` skill in the subagent prompt so it follows this repo's conventions.
