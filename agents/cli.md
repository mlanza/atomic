# CLI Implementation Roadmap

*General Guidance Illustrated by `reel`.*

## 1. Purpose and Approach

This document provides **general guidance** for designing command-line interfaces that evolve from a minimal command executor into a fully interactive shell. It uses **`reel`** as a concrete example — a working CLI meant to model best practices for other projects to follow.

Each phase is written **as if it’s the only one that exists**. Future capabilities (“Bolting on a REPL,” “Bolting on a TUI,” “Reifying the Commands”) appear later as *retrofits* that preserve backward compatibility.

The goal is to let agents (and developers) deliver working CLIs quickly, then layer on interactivity and ergonomics while keeping consistent semantics.

## 2. What `reel` Is and Does

`reel` models the **timeline of a board-game table**. Every command manipulates or queries that temporal model.

### Required and Optional Inputs

* **`table_id`** — required everywhere (example `QDaitfgARpk`)
* **`--seat`** — optional (defaults to `null`, but all examples use `--seat 1` for consistency)

### Commands

| Command     | Description                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| `inception` | Jump to the **initial game state**.                                                 |
| `present`   | Jump to the **current moment**; only from here may moves be issued.                 |
| `backward`  | Step one frame **backward** through the timeline.                                   |
| `forward`   | Step one frame **forward** through the timeline.                                    |
| `at <id>`   | Jump directly to a **specific hash** (e.g., `Lnm0M`) representing a moment in time. |

There are other verbs, but this is enough to give you a sense of what it does.

## 3. The Growth Path: Incremental Delivery Roadmap

Before building anything, the agent should understand the **planned path of incremental delivery**.
Each milestone stands alone — it’s complete and usable in its own right.
Later phases only *extend* earlier ones.

| Phase | Capability            | Key Concept                                                                    |
| ----- | --------------------- | ------------------------------------------------------------------------------ |
| **1** | MVP — Command Mode    | Runs queued commands or piped input; returns meaningful state to the terminal. |
| **2** | REPL Added            | Continuous interactive loop built on the same core.                            |
| **3** | TUI Added             | Keystroke-driven interface layered on the same state model.                    |
| **4** | Reifying the Commands | Flags mirror verbs for ergonomic scripting.                                    |

## 4. Guiding Principles

These principles apply to every phase of development.
They ensure that both humans and agents can understand, operate, and extend the CLI without guesswork.

### Returning Meaningful Data

Every execution — whether from a one-shot command, a script, or an interactive session — must **return significant data** to the terminal.

That output is the exposed state model (conceptually, the JS object held in the atom).
It allows agents and humans alike to *see what’s happening* rather than trust silent success.

Returned data should:

* Represent the current state of the model (timeline position, active seat, etc.).
* Include signals of success, error, or transition.
* Be descriptive enough that a user or agent can infer “what this CLI is modeling.”

> Without meaningful output, the user is blind; the CLI becomes a black box.
> For agents, this visibility is what makes autonomous reasoning possible.

### 📜 Keeping a Transcript

> **Every time a command changes state, the CLI must print both the command and the resulting state.**

This makes `reel` a transparent transcript of interaction — a textual ledger of what occurred and what followed.
Each block of output is both an audit trail and a feedback loop for agents.

```
> at Lnm0M
{ "table": "QDaitfgARpk", "seat": 1, "position": "Lnm0M", "status": "OK" }

> backward
{ "table": "QDaitfgARpk", "seat": 1, "position": "Lnm0K", "status": "OK" }
```

This behavior is non-negotiable:

* It reveals which command produced which state.
* It lets agents reason causally about outcomes.
* It gives humans visible confirmation of success or failure.

### 🧭 Help and Discoverability

> ⚙️ **Imperative:** Maintain *robust, discoverable help* at every increment.
> A CLI must always be self-teaching — an agent or human should be able to ask it how to operate.

Help must include:

* **Top-level help (`--help`)** describing usage and flags.
* **Subcommand help** (`repl --help`, `tui --help`) describing mode-specific details.
* **A mental-model flag (`-mm`, `--mental-model`)** explaining what the CLI represents conceptually.

Example:

```
USAGE
  reel <table_id> [--seat N] [flags]

FLAGS
  -c, --command <cmd>  Execute one or more commands in order
  --seat <n>  Optional seat number (defaults to null)
  -mm, --mental-model  Explain what 'reel' represents and how to think about it
```

Help isn’t decoration — it’s infrastructure. Agents rely on it for exploration; humans rely on it for orientation.

### The Mental Model

The **mental model** (`-mm`) provides the conceptual frame that teaches the operator what’s being modeled. It explains:

* the structure of the state object,
* what each attribute represents, and
* scaffolding for understanding how the commands listed in help operate on that structure.

Its purpose is to make **the system’s conceptual core explicit** — not to replace documentation, but to make it living and inspectable from within the CLI.

#### Negotiation and Persistence

The mental model isn’t static. It’s a *living document* the agent and director maintain together. It is stored externally in a Markdown file (e.g., `reel-mm.md`).

The `-mm` command simply prints this file (using a `fetch` or dynamic import). This ensures that:

* **the agent** keeps a persistent, inspectable record of its conceptual understanding, and
* **the director** can confirm that the agent’s mental model is in alignment with his.

The director is effectively *negotiating* with the agent — describing what he wants the app to be and to do. He may **seed** this document, but if not, the agent must **infer** it from the product requirements and update it continually.

This model is **organic**, evolving through collaboration. The agent must keep it aligned with the director’s intent as new insights arrive. It is meant for collaboration and independent versioning — a durable mirror of shared understanding.

Just as an agent might query an MCP server to learn what services and tools it can access, this document serves the same purpose:

> It’s a structured knowledge transfer — a dump of understanding made explicit.

## 5. MVP — Command Mode

This is the foundation: a scriptable CLI that executes one or more commands and exits.
No REPL, no TUI — just command sequencing and visible state.

### USAGE

```
reel <table_id> [--seat N] [flags]
```

### Behavior

* `table_id` is required.
* `--seat` optional (defaults to `null`).
* One or more `-c` flags may be passed; they’re executed sequentially within one session.

Example:

```zsh
reel QDaitfgARpk --seat 1 -c "at Lnm0M" -c "backward" -c "backward"
```

If no input is provided, `reel` shows help.

### Scripting via Standard Input

When `stdin` is **not a TTY**, `reel` reads one command per line and executes until EOF.

```zsh
printf "at Lnm0M\ninception\npresent\nforward\n" | reel QDaitfgARpk --seat 1
```

Each command runs in the same session, printing the precipitating command and resulting state after every action.

## 6. Bolting on a REPL

Adds a **read-eval-print loop** for continuous command entry.

### USAGE

```
reel <table_id> [--seat N] [flags]
reel repl <table_id> [--seat N] [flags]
```

### Behavior

* `reel repl` opens a prompt (`>`).
* Any `-c` commands execute first.
* Each input line is parsed and applied to the same state model.
* The CLI continues to print the precipitating command and resulting state after every action.

Example:

```zsh
reel repl QDaitfgARpk --seat 1 -c "present"
> backward
> at Lnm0M
> forward
> quit
```

Interactive commands:

* `help` — lists commands.
* `quit`, `exit`, `q` — ends session.

Retrofit rule: REPL doesn’t alter command mode — it extends it using the same principles and help structure.

## 7. Bolting on a TUI

Adds a keystroke-driven interface (text UI) built atop the same model.

### USAGE

```
reel <table_id> [--seat N] [flags]
reel repl <table_id> [--seat N] [flags]
reel tui <table_id> [--seat N] [flags]
```

### Behavior

* `reel tui` opens the full-screen interface.
* `-c` commands execute first.
* Press `?` or `F1` for key help.

Example:

```zsh
reel tui QDaitfgARpk --seat 1 -c "present"
```

### Navigating Between Modes

| From     | Action                      | To                 |
| -------- | --------------------------- | ------------------ |
| **TUI**  | Press **Escape**            | Return to **REPL** |
| **REPL** | Type `tui`                  | Enter **TUI**      |
| **REPL** | Type `quit`, `exit`, or `q` | Exit the program   |

The same mental model (`reel-mm.md`) informs all interactive layers.

## 8. Reifying the Commands

Finally, expose the verbs as direct flags for ergonomic scripting.

### USAGE

```
reel <table_id> [--seat N] [flags]
reel repl <table_id> [--seat N] [flags]
reel tui <table_id> [--seat N] [flags]
```

### Behavior

Reified flags act as shorthand for their `-c` equivalents:

```zsh
reel QDaitfgARpk --seat 1 -c "at Lnm0M" -c "inception" -c "present" -c "forward"
reel QDaitfgARpk --seat 1 --at Lnm0M --inception --present --forward
```

They execute in order of appearance, share session state, and must appear in `--help` and the mental model output.

Retrofit rule: reification adds expressiveness but doesn’t alter semantics.

## 9. Closing Principle

> The CLI exists to **prove the core is solid** — to demonstrate that the domain logic is coherent and observable long before any GUI or DOM view exists.

A robust CLI:

* exposes its internal data after each command,
* documents its conceptual frame (`-mm`), and
* synchronizes understanding between agent and director.

When both can articulate the same evolving mental model, the foundation is verified — and ready for whatever interface comes next.
