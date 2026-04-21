#!/bin/bash
# afterFileEdit hook: warn when edited .tsx files use deprecated Polaris components.
# Returns `additional_context` so the agent sees the warning on its next turn.

set -u

input=$(cat)

# Extract the edited file path. afterFileEdit payload has { file_path: "..." }.
file_path=$(printf '%s' "$input" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

# Only act on .tsx / .ts files.
case "$file_path" in
  *.tsx|*.ts) ;;
  *) echo '{}'; exit 0 ;;
esac

# Skip if file no longer exists (e.g. deleted).
if [ ! -f "$file_path" ]; then
  echo '{}'
  exit 0
fi

# Look for deprecated Polaris imports / component usage.
deprecated_found=""
while IFS= read -r pattern; do
  if grep -qE "$pattern" "$file_path"; then
    deprecated_found="${deprecated_found}  - matched: ${pattern}\n"
  fi
done <<'EOF'
from '@shopify/polaris'[^;]*\b(Stack|Inline|Heading|DisplayText|Subheading|Caption|TextStyle|Loading|Modal|Sheet|Toast|TopBar|Navigation)\b
<Stack[[:space:]>]
<Inline[[:space:]>]
<Heading[[:space:]>]
EOF

if [ -n "$deprecated_found" ]; then
  # Escape for JSON
  msg="Deprecated Polaris components detected in ${file_path}:\n${deprecated_found}Replace with: Stack->BlockStack, Inline->InlineStack, Heading/DisplayText/Subheading/Caption/TextStyle->Text with variant/tone. See .cursor/rules/figma-to-polaris.mdc."
  printf '{"additional_context": "%s"}' "$(printf '%b' "$msg" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\t/\\t/g' | awk '{printf "%s\\n", $0}')"
  exit 0
fi

echo '{}'
exit 0
