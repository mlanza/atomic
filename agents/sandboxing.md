# Sandboxing

A **Sandbox** is a named folder and an endorsed area of autonomy for an agent to work freely. It is both a boundary and a promise — a defined space where the agent can create, iterate, and refactor without disturbing the wider system.

A name (e.g., `widget`) is assigned to a folder which becomes your sandbox. Within it, create at minimum:

* **Core:** pure domain logic (`core.js`).
* **Shell:** wiring, events, persistence, DOM (`main.js`).
* **CLI:** testing/verification harness (`cli.js`).
* **PRD:** product rationale and scratchpad (`prd.md`).
* **TODO:** incremental plan toward *Definition of Done* (`todo.md`).

You may add files as needed (≤ 10 total). You may update anything in the sandbox. Do **not** update outside the sandbox without explicit permission.

### Purpose

The sandbox pattern exists to ensure **modularity and focus**. It isolates an idea in its own corner — safe, contained, and independent. It lets the agent experiment without consequence, proving an approach in miniature before connecting it to the larger network of files.

This practice recognizes that *wiring things up too early is dangerous*. Integration introduces risk. Sandboxes keep exploration safe and localized until a concept is solid.

### Autonomy and Boundaries

Within the sandbox, the agent **can update freely** — write, overwrite, and reorganize files at will. Outside it, the agent **can read freely** but not write. This clear read-anywhere, write-here rule preserves creative freedom while preventing collateral changes.

### Why It Matters

By encouraging agents to think in sandboxes, we keep creative work disciplined. Each idea can mature in isolation, growing clear and correct before it touches shared code. It’s not just about safety; it’s about craftsmanship. Sandboxing promotes deliberate progress — a modular approach to innovation that scales without chaos.
