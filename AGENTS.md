# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Cursor, Copilot, Antigravity, etc.) when working with code in this repository.

## Mandatory Startup Behavior

Read this file first on every session start.

### Critical Analysis Requirement

When the user makes a technical claim, proposes an approach, or asks for judgment:

- Never auto-agree with the user.
- Analyze critically and state whether the user is fully right, partially right, or wrong.
- Explain why with evidence from code, tests, logs, docs, or behavior.
- Prioritize technical correctness over validation.

## Index

Skill entrypoints live under `skills/`. Load the relevant `SKILL.md` before using a skill, then follow any references or scripts from that skill's folder as needed.

- `skills/api-and-interface-design/SKILL.md` - Stable API, module boundary, and contract design.
- `skills/angular-developer/SKILL.md` - Angular code generation and architecture guidance.
- `skills/browser-testing-with-devtools/SKILL.md` - Browser runtime testing and debugging through Chrome DevTools MCP.
- `skills/ci-cd-and-automation/SKILL.md` - CI/CD pipeline setup, quality gates, and deployment automation.
- `skills/code-review-and-quality/SKILL.md` - Multi-axis code review before merging changes.
- `skills/code-simplification/SKILL.md` - Behavior-preserving refactoring for clarity.
- `skills/context-engineering/SKILL.md` - Agent context setup and rules-file hygiene.
- `skills/debugging-and-error-recovery/SKILL.md` - Systematic root-cause debugging.
- `skills/deprecation-and-migration/SKILL.md` - Deprecation, migration, and sunset planning.
- `skills/doubt-driven-development/SKILL.md` - Adversarial review for high-stakes or uncertain decisions.
- `skills/documentation-and-adrs/SKILL.md` - Documentation and architectural decision records.
- `skills/frontend-ui-engineering/SKILL.md` - Production-quality user-facing UI implementation.
- `skills/git-workflow-and-versioning/SKILL.md` - Git workflow, commits, branches, and versioning.
- `skills/idea-refine/SKILL.md` - Structured idea refinement and assumption stress-testing.
- `skills/incremental-implementation/SKILL.md` - Delivering multi-file changes in small, safe steps.
- `skills/interview-me/SKILL.md` - One-question-at-a-time requirement discovery.
- `skills/nestjs-best-practices/SKILL.md` - NestJS architecture, security, validation, Prisma, auth, and backend best practices.
- `skills/performance-optimization/SKILL.md` - Performance profiling and optimization.
- `skills/planning-and-task-breakdown/SKILL.md` - Breaking clear requirements into implementable tasks.
- `skills/prisma-cli/SKILL.md` - Prisma CLI commands for init, generate, migrate, db, studio, and MCP workflows.
- `skills/prisma-client-api/SKILL.md` - Prisma Client queries, filters, relations, transactions, raw SQL, and client methods.
- `skills/prisma-database-setup/SKILL.md` - Prisma database provider setup for PostgreSQL, Prisma Postgres, SQLite, MySQL, MongoDB, and others.
- `skills/prisma-driver-adapter-implementation/SKILL.md` - Prisma v7 SQL driver adapter contracts and implementation guidance.
- `skills/prisma-postgres/SKILL.md` - Prisma Postgres Console, create-db, Management API, and SDK workflows.
- `skills/prisma-postgres-setup/SKILL.md` - Provisioning and connecting a new Prisma Postgres database through the Management API.
- `skills/prisma-upgrade-v7/SKILL.md` - Prisma ORM v6 to v7 migration guidance and breaking-change handling.
- `skills/security-and-hardening/SKILL.md` - Security hardening for auth, input, storage, and integrations.
- `skills/shipping-and-launch/SKILL.md` - Production launch planning, monitoring, rollout, and rollback.
- `skills/source-driven-development/SKILL.md` - Official-source-grounded implementation decisions.
- `skills/spec-driven-development/SKILL.md` - Specification creation before significant coding.
- `skills/test-driven-development/SKILL.md` - Test-first behavior changes and bug fixes.
- `skills/using-agent-skills/SKILL.md` - Meta-skill for discovering and invoking other skills.

## Rule Precedence

When rules appear to conflict, use this order:

1. Safety and data integrity rules
2. Tenant/auth/security rules
3. Explicit user instruction for the current task
4. Core engineering defaults
5. Style and formatting preferences

If still ambiguous, call out the conflict and choose the safest path.
