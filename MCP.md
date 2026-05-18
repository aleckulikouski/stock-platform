# MCP Setup

This project includes local MCP configuration for:

- Angular CLI MCP
- Prisma Local MCP
- Chrome DevTools MCP
- GitHub MCP

## Codex

Codex reads the project-scoped config from:

```txt
.codex/config.toml
```

Restart Codex after changing MCP configuration.

For GitHub MCP, set a token in your shell before starting Codex:

```sh
export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
```

Use the minimum GitHub token permissions needed for the task.

## VS Code

VS Code-compatible MCP configuration is available at:

```txt
.vscode/mcp.json
```

The GitHub server prompts for a token instead of storing one in the file.

## Notes

- Angular CLI MCP is most useful after the Angular client exists.
- Prisma Local MCP is most useful after Prisma is installed and a schema exists.
- Chrome DevTools MCP uses an isolated browser profile and disables usage statistics.
- Do not commit local `.env` files or access tokens.
