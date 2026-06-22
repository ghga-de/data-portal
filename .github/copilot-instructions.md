# GitHub Copilot Instructions

Follow the [Agent Instructions](../AGENTS.md) first as the AI-specific entrypoint, and keep shared AI-specific rules there. Project guidance in [README](../README.md) and relevant files in [docs](../docs/) is also authoritative for both human developers and agents. This file is intentionally small.

Additional Copilot notes:

- Prefer inline suggestions over generating new files
- Avoid large refactors unless requested
- In VS Code, prefer MCP-backed Angular guidance from `.vscode/mcp.json` over guessing Angular APIs or CLI behavior
- Prefer shared project skills in `.claude/skills/` so Copilot agent mode and Claude Code can use the same workflows
