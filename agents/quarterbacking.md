# Quarterbacking

## 1. The What: Playing the Field

Think of your work like football. You’re the quarterback—eyes up, reading the field, calling plays one at a time. Each command you run through [the CLI](./cli.md), each function you refine, is a play that advances the ball a few yards.

No one expects a Hail Mary. We’re a ground-game team—disciplined, deliberate, confident in short gains. Each successful swap, each verified function, moves the chain. Over time, those yards become drives, and drives become touchdowns.

You own the field between huddles. Within [your sandbox](./sandboxing.md), autonomy is total. You decide the next play, call it, and execute. The CLI is your playbook and your voice on the line. The plan evolves one down at a time.

Only pause when it’s time to meet the coach on the sideline—checkpoint moments, reviews, or course corrections. That’s when we reset, re-plan, and head back out. Until then, keep the ball in motion. Small, verifiable gains are the surest way to stay in control of the game.

Quarterbacking isn’t about following orders; it’s about running the offense. The agent owns the plan and guarantees that every drive is designed to do its job, while also ensuring the series lands the director's vision in the endzone.

## 2. The Why: Small Bets, Vertical First

The agent’s job is to design a **series of drives**, each one a self-contained, demonstrable advance of the system. A drive isn’t a guess or a fragment—it’s a working slice that proves the plan is sound, front to back.

Because every drive ends in a runnable state, the director can call a **sideline conference** at any time to review progress end-to-end. That visibility is the point. Drives exist so the director can evaluate the work as it lives, not as it’s promised. The rule is simple: **working software is the only trustworthy signal.**

This rhythm embodies the **Small Bets** philosophy—make compact, reversible commitments that yield real feedback and keep communication sharp. Each drive tests not just architecture, but alignment: between agent, director, and intent.

### Supporting Ideas

* **Tracer Bullet Development** — Send a working round through the full stack early to confirm direction and expose errors in aim or understanding.
* **Vertical Slice Development** — Apply that tracer philosophy iteratively: deliver thin, complete slices that build confidence and coherence.
* **Small Bets Philosophy** — Make small, reversible commitments that yield maximal learning about both the system and the collaboration behind it.

## 3. The How: Working Software, Baby Steps

### 3.1 Delivering in Baby Steps

Working software isn’t a phase—it’s the rule. Each drive should move the system forward *just far enough* that it still runs, still teaches you something, and can still be verified through the CLI.

You’re reshaping the system inch by inch, staying upright after every hit. Some drives will take three or four careful plays to get over the line, but the drive doesn’t close until the system runs clean and complete. The discipline is what keeps the game alive.

### 3.2 Dependency Discipline

Golden Rule:
**All drive dependencies point backward, never forward.**

A drive’s success cannot hinge on work described in a future drive.

**Drives are sealed capsules.** If a change can’t be proven through the CLI before the next drive begins, the current drive isn’t done.

Cross-drive dependencies aren’t collaboration; they’re coupling. The agent must design the plan so that each drive can stand alone and be verified independently.

This isn’t ceremony. It’s the safeguard that keeps momentum real. When drives leak dependencies, confidence collapses. When each drive closes with a working path, the system stays alive—even mid-refactor.

* Each drive represents a **vertical slice**—a thin, end-to-end cut touching core, shell, and CLI.
* When you finish a drive, the app should start, respond to commands, and give observable output.
* You can stop after any drive and still have a cohesive, verifiable system.

*If a drive can’t be run, it’s not a drive—it’s a draft.*

## 4. The Instruments: PRD and TODO

Quarterbacking depends on two tools for self-governance: the **PRD** and the **TODO**. They keep intention and execution aligned.

### 4.1 PRD (`prd.md`)

The PRD captures the reasoning and material that give shape to the director’s vision. It’s where the agent thinks out loud—links, notes, sketches, decisions. It explains *why* things are being done, not just *what*.

Done right, it’s the agent’s field notebook—everything needed for the next play within reach. The director may provide it up front or evolve it through exchange, but the agent owns keeping it accurate.

### 4.2 TODO (`todo.md`)

The TODO is the game plan. It translates the PRD’s big picture into a visible sequence of **drives**, each labeled with a **letter** (A–Z). Every drive represents a short, chronological series of plays working toward a measurable first down or milestone.

Use **headings** to mark drives clearly. Within each drive, list tasks in order. Each task gets a **letter–number pair** (e.g., `A1`, `A2`). Together, these form a timeline rather than a checklist—**no boxes, no marks**, just a clear order of play.

Each drive is a self-contained subplan: a concise, actionable path to a meaningful outcome. The TODO should read like a field plan—compact, direct, and free of clutter. Each play states what’s to be done, how completion is recognized, and where it fits in the larger drive.

**Own your dependencies vertically.** If core logic changes, the same drive must include its shell and CLI adapters so the system still runs. The TODO must never sequence drives such that one depends on unfinished work in a future drive. Drives look backward for support, never forward.

Checkpoints and **sideline conferences** (see *Small Bets*, *Vertical First*) mark natural pauses for adjustment before the next drive begins.

## 5. The Dashboard: Frontmatter

Every `todo.md` begins with a small YAML frontmatter block that tracks status:

```yaml
---
agent:
  active_drive: A
  active_task: A3
  drives: [A, B, C]
  confirm_on_switch: true
  archive_completed: true
---
```

This acts as the agent’s **dashboard**: `active_drive` and `active_task` show what’s in play, `drives` shows the sequence, and the switches control how progress is archived. It’s declarative, not automatic—a map for continuity.

When the plan completes, null these values to mark closure and preserve the record.

## 6. Definition in Practice

Quarterbacking unifies these habits:

1. **Eyes up.** Think strategically, not just tactically. Stay aware of dependencies, goals, and upcoming drives.
2. **Stay vertical.** Build end-to-end features that work all the way through, rather than polishing one layer in isolation.
3. **Seal your drive.** Never hand off work that requires a later drive to make it executable. Each drive ends in a runnable, verifiable system.
4. **Demonstrate success.** Each drive ends with you demonstrating success via the CLI.
5. **Mind the planning strategy.** The PRD is purpose; the TODO is motion; [Recon](./recon.md) is focus.

Together, these habits keep the app alive, testable, and always one play away from improvement.

### Closing Thought

Quarterbacking is the discipline of momentum. Move the ball one tested play at a time. Keep the system running. Always be able to show that it works.

That’s how Atomic teams move fast without breaking things.
