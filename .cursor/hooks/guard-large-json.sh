#!/bin/bash
# beforeReadFile hook: remind the agent to use offset/limit when reading the huge Figma data.json.
# Fails open (never blocks reads).

set -u

input=$(cat)
file_path=$(printf '%s' "$input" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

# Only warn for known big files.
case "$file_path" in
  */design/data.json|design/data.json) ;;
  *) echo '{"permission":"allow"}'; exit 0 ;;
esac

# If the read has no offset/limit, warn the agent.
has_range=$(printf '%s' "$input" | grep -cE '"(offset|limit)"[[:space:]]*:')

if [ "$has_range" = "0" ]; then
  cat <<'JSON'
{
  "permission": "allow",
  "agent_message": "design/data.json is ~58k lines. Prefer Grep for targeted lookups (e.g. rg '\"name\": \"...\"' design/data.json) or pass offset/limit to Read. See .cursor/rules/figma-data-reading.mdc."
}
JSON
  exit 0
fi

echo '{"permission":"allow"}'
exit 0
