#!/usr/bin/env bash

# Pre-commit hook: Block sensitive files from being committed
# Usage: Add to .husky/pre-commit or .git/hooks/pre-commit

set -euo pipefail

# Blocklist patterns (glob-style)
BLOCKED_PATTERNS=(
  # Environment and config files
  ".env"
  ".env.*"
  "*.env"

  # Private keys and certificates
  "*.pem"
  "*.key"
  "*.p12"
  "*.pfx"
  "*.jks"
  "*.keystore"

  # Credential files
  "*.credentials"
  "*credentials.json"
  "*service-account*.json"
  "*secret*.json"

  # Cloud provider configs
  ".aws/*"
  ".gcp/*"
  ".azure/*"

  # SSH keys
  "id_rsa"
  "id_ed25519"
  "id_ecdsa"
  "*.pub"

  # OS and IDE files
  ".DS_Store"
  "Thumbs.db"
  ".vscode/settings.json"
  ".idea/*"

  # Other sensitive files
  "*.sqlite"
  "*.db"
  "*.sql"
  "*.bak"
  "*.dump"
)

# Allowlist for exceptions (exact paths relative to repo root)
ALLOWED_FILES=(
  ".env.example"
  ".env.template"
  ".env.sample"
)

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

is_allowed() {
  local file="$1"
  for allowed in "${ALLOWED_FILES[@]}"; do
    if [[ "$file" == "$allowed" ]]; then
      return 0
    fi
  done
  return 1
}

matches_pattern() {
  local file="$1"
  local basename
  basename=$(basename "$file")

  for pattern in "${BLOCKED_PATTERNS[@]}"; do
    # Check against full path (for patterns like .aws/*)
    # shellcheck disable=SC2254
    case "$file" in
      $pattern) return 0 ;;
    esac
    # Check against basename (for patterns like *.pem)
    # shellcheck disable=SC2254
    case "$basename" in
      $pattern) return 0 ;;
    esac
  done
  return 1
}

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACR 2>/dev/null || true)

if [[ -z "$STAGED_FILES" ]]; then
  exit 0
fi

VIOLATIONS=()

while IFS= read -r file; do
  if matches_pattern "$file" && ! is_allowed "$file"; then
    VIOLATIONS+=("$file")
  fi
done <<< "$STAGED_FILES"

if [[ ${#VIOLATIONS[@]} -gt 0 ]]; then
  echo -e "${RED}✖ Blocked sensitive files detected in staged changes:${NC}"
  echo ""
  for file in "${VIOLATIONS[@]}"; do
    echo -e "  ${YELLOW}→ ${file}${NC}"
  done
  echo ""
  echo -e "  To unstage:  ${GREEN}git reset HEAD <file>${NC}"
  echo -e "  To bypass:   ${GREEN}git commit --no-verify${NC} (not recommended)"
  echo ""
  echo "  If a file is safe to commit, add it to ALLOWED_FILES in this script."
  exit 1
fi

exit 0
