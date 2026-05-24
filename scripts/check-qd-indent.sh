#!/usr/bin/env bash
# Fail if layout block functions (.row, .clip, .container, …) lack +4 space child indent.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
errors=0

while IFS= read -r file; do
  if ! python3 - "$file" <<'PY'
import re
import sys

STRICT = re.compile(r"^(\s*)\.(row|clip|grid|container|foreach|if|function)\b")
path = sys.argv[1]
lines = open(path, encoding="utf-8").read().splitlines()
file_errors = []

for i, line in enumerate(lines):
    match = STRICT.match(line)
    if not match:
        continue

    parent = len(match.group(1))
    block = match.group(2)
    j = i + 1
    while j < len(lines) and not lines[j].strip():
        j += 1
    if j >= len(lines):
        continue

    next_line = lines[j]
    child = len(next_line) - len(next_line.lstrip())
    required = parent + 4
    if block == "container" and not next_line.lstrip().startswith("."):
        required = parent

    if child < required:
        file_errors.append(
            f"{path}:{i + 1}: .{block} needs indent >= {required} on next line "
            f"(parent={parent}, child={child})"
        )

for message in file_errors:
    print(message, file=sys.stderr)

sys.exit(1 if file_errors else 0)
PY
  then
    errors=1
  fi
done < <(find "$root/src" -name '*.qd' | sort)

exit "$errors"
