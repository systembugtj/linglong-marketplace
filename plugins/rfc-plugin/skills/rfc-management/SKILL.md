---
name: rfc-management
description: Manage RFC files, ROADMAP.md, and TASK_TRACKING.md—create numbered RFCs, update status, archive completed work, and keep exactly three sources in sync (no README indexes under .spec/). Use when adding RFCs, changing RFC status, syncing roadmap phases, updating task boards, or archiving to completed/rejected. For implementing an approved RFC in code, pair with rfc-workflow. Discover paths first (.spec/rfc, docs/rfc, etc.).
---

# RFC management

Manage **where RFC metadata lives** and **how files stay in sync**. Implementation checkpoints live in **rfc-workflow**; this skill owns the **document tree**.

## When to use which skill

| User intent | Skill |
|-------------|-------|
| New RFC, status change, ROADMAP row, TASK_TRACKING rows, archive | **rfc-management** (this skill) |
| Read RFC, plan code, get approval, then implement | **rfc-workflow** |
| Both (e.g. “add RFC 0004 and implement it”) | rfc-management first → rfc-workflow after **Approved** |

## Three files only — never duplicate

```
ROADMAP.md          → index, phases, status, conventions (THE index)
TASK_TRACKING.md    → all tasks and done items (THE tracker)
rfc/NNNN-slug.md    → proposal text only (THE spec body)
```

| Put it here | Never put it here |
|-------------|-------------------|
| RFC id, title, status, phase | `rfc/README.md`, `.spec/README.md`, root README |
| Checklists, in-progress, done | Inside RFC markdown files |
| Summary, motivation, design | ROADMAP tables (except one index row) |

**linglong-marketplace:** `.spec/ROADMAP.md`, `.spec/TASK_TRACKING.md`, `.spec/rfc/`. No `.spec/README.md` or `.spec/rfc/README.md`.

Other repos may use `docs/rfc/`, `design/` — discover paths; same **three-role** split.

## Discover paths (always first)

1. Find `ROADMAP.md` (often `.spec/ROADMAP.md`).
2. Find `TASK_TRACKING.md` (same prefix as ROADMAP).
3. Find RFC directory (e.g. `.spec/rfc/`).
4. Read ROADMAP **RFC conventions** + one existing RFC for section shape.
5. Confirm next id = highest id in ROADMAP index + 1.

If ROADMAP is missing conventions, propose: `NNNN-kebab-slug.md`, status enum below, tasks only in TASK_TRACKING.

## Status enum

Use the **same label** in ROADMAP index, RFC header, and phase notes:

`Draft` → `Under Review` → `Approved` → `Implemented`  
Also: `Rejected`, `Superseded`

| Status | Meaning | RFC file location |
|--------|---------|-------------------|
| Draft | WIP spec | `rfc/NNNN-slug.md` |
| Under Review | Ready for feedback | `rfc/NNNN-slug.md` |
| Approved | Accepted; may implement | `rfc/NNNN-slug.md` |
| Implemented | Shipped | move to `rfc/completed/` |
| Rejected | Won't do | move to `rfc/rejected/` |
| Superseded | Replaced | move to `rfc/rejected/` or `completed/`; link new id in ROADMAP |

## Playbook A — Create a new RFC

Do **all steps in one change set** unless the user asked for draft-only review.

1. **ROADMAP** — pick next `NNNN`; add index row (id, linked title, `Draft`).
2. **RFC file** — create `rfc/NNNN-short-slug.md` with header `**Status:** Draft` and sections:
   - Summary
   - Motivation
   - Proposal
   - Implementation notes
   - Alternatives considered (optional)
3. **TASK_TRACKING** — add `- [ ] … (RFC NNNN)` lines for concrete work; **no** task lists inside the RFC.
4. **ROADMAP** — if new phase needed, add phase section referencing `NNNN`.

**Do not:** create README indexes, duplicate the index table in the RFC, or add tasks only in the RFC body.

## Playbook B — Advance status

| To status | Update in same session |
|-----------|------------------------|
| Under Review | ROADMAP row + RFC header |
| Approved | ROADMAP row + RFC header; ensure TASK_TRACKING has implementation tasks |
| Implemented | ROADMAP row + move file to `rfc/completed/` + mark TASK_TRACKING items done + note phase in ROADMAP |

Never leave ROADMAP saying `Approved` while the RFC header says `Draft`.

## Playbook C — Complete (Implemented)

1. Verify acceptance against RFC proposal (and TASK_TRACKING).
2. `git mv` RFC → `rfc/completed/NNNN-slug.md` (or repo’s archive path).
3. ROADMAP: set status `Implemented`; keep index row or move to a “completed” subsection per house style.
4. TASK_TRACKING: check off all related items; add PR/commit links if the team does that.
5. ROADMAP: mark phase done or shrink “next” section so upcoming work is obvious.

## Playbook D — Reject or supersede

1. ROADMAP: status `Rejected` or `Superseded`; if superseded, note replacement RFC id.
2. Move file to `rfc/rejected/` (or archive path).
3. TASK_TRACKING: cancel open items with one-line reason; do not delete history.
4. Do not leave orphaned tasks pointing at a rejected RFC without explanation.

## Playbook E — User asks to implement an RFC

1. Confirm RFC status is **Approved** (or user explicitly waives review).
2. Switch to **rfc-workflow** for analysis → options → plan → execution.
3. After merge: run **Playbook C** (Implemented) in the same PR or immediate follow-up.

## Pre-commit checklist (RFC changes)

- [ ] ROADMAP index matches every active RFC file
- [ ] No task checklists inside RFC bodies
- [ ] No new README under `.spec/` or `rfc/` for indexing
- [ ] RFC header status matches ROADMAP row
- [ ] TASK_TRACKING updated for new or finished work
- [ ] Archived RFCs not left in active `rfc/` root

## Working principle

**ROADMAP** = what and when. **TASK_TRACKING** = who does what now. **RFC files** = why and how. One story across three places.
