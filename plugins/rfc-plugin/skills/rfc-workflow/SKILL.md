---
name: rfc-workflow
description: Implement or review work from an RFC spec—analyze the RFC under .spec/rfc/, present numbered options, get explicit approval, then execute in controlled steps. Use when the user says implement the RFC, according to RFC, or references .spec/rfc/NNNN-slug.md. After code ships, update .spec/ROADMAP.md and .spec/TASK_TRACKING.md per rfc-management. Do not skip approval gates. Pair with rfc-management when creating or archiving RFCs.
---

# RFC workflow

Turn an **approved RFC** into code (or analysis-only review) with explicit human checkpoints: **analyze → choose scope → plan → execute**.

**File hygiene** (`.spec/ROADMAP.md`, `.spec/TASK_TRACKING.md`, archives) is **rfc-management** — use that skill when creating RFCs, changing status, or closing work.

## When to use which skill

| Step | Skill |
|------|-------|
| RFC missing or still Draft | **rfc-management** — Playbook A/B |
| RFC Approved, user wants implementation | **rfc-workflow** (this skill) |
| Implementation merged | **rfc-management** — Playbook C (Implemented) |

## Core rule

**Silence is not approval.** Wait for a numbered option (Phase 2) or explicit yes (Phase 3) before substantive repo edits.

## Phase 0 — Locate the spec

1. Resolve RFC path (e.g. `.spec/rfc/0042-feature.md`) or id from **`.spec/ROADMAP.md`** index.
2. Read ROADMAP row for status — if not `Approved`, stop and ask or use rfc-management to advance status.
3. Read RFC body; read **`.spec/TASK_TRACKING.md`** for related open tasks (do not add tasks inside the RFC).

## Phase 1 — RFC analysis

1. Read the RFC end-to-end.
2. Extract: summary, motivation, proposal, implementation notes, dependencies on other RFCs.
3. Output using the Phase 1 template in [references/workflow-templates.md](references/workflow-templates.md).
4. List ambiguities as questions — do not guess.

## Phase 2 — Implementation options

Present options from [references/workflow-templates.md](references/workflow-templates.md) Phase 2 block. **Stop** until the user picks 1–4.

## Phase 3 — Detailed plan

For options 1–3, file-level plan using Phase 3 template. **Stop** until explicit yes/no.

## Phase 4 — Controlled execution

After yes:

1. One logical unit at a time.
2. Show meaningful diffs before applying when changes are large or risky.
3. Map each step to `.spec/TASK_TRACKING.md` items (update tracker via rfc-management rules, not inside RFC files).
4. On completion: hand off to **rfc-management Playbook C** — `.spec/ROADMAP.md` `Implemented`, archive RFC under `.spec/rfc/completed/`, check off tasks.

Use Phase 4 decision menu from [references/workflow-templates.md](references/workflow-templates.md) when the user needs to steer mid-flight.

## RFC body map (what to read)

| Section | Use for |
|---------|---------|
| Summary | Scope anchor |
| Motivation | Constraints |
| Proposal | Architecture / behavior |
| Implementation notes | Files, packages, CI |
| Alternatives | Do not re-litigate rejected paths |

Tasks are **not** in the RFC — read **`.spec/TASK_TRACKING.md`**.

## Creating a new RFC during workflow

If the user wants a spec before coding:

1. Use **rfc-management Playbook A** (`.spec/ROADMAP.md` + `.spec/rfc/` file + `.spec/TASK_TRACKING.md`).
2. Present draft for review; advance to **Approved** before Phase 1 implementation work.
3. Naming: `.spec/rfc/NNNN-kebab-slug.md` (four-digit id from `.spec/ROADMAP.md`).

## Safety habits

- Ask at branch points; RFCs omit ordering and migration detail.
- Keep a short changelog of touched files for rollback.
- Unclear spec → questions, not the convenient reading.
