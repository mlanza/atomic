# Core

The `core` module provides the building blocks for Atomic.  It enables the building of an app's functional core.

It *predominantly* has pure operations.  It has side-effecting operations too.  That's because any moderately robust functional programming library relies on, just to build itself, a modest number of mutating operations, like `doto`.

These operations are reexported from `shell`.  As an external consumer, to be notably more pronounced about the side effecting nature of said functions (e.g. `$.doto`), import such operations from there.
