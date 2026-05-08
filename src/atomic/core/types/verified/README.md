# Verified

A functor which guarantees invariants hold true for the life of the value and that no change (`fmap`) can bring it to an unverifiable state.

## Fluent

The fluent functor allows one map over commands (no return value) and queries (return value).  When a command is mapped, since there is no return value, the prior value is retained.  This makes it possible to interject side effects into a fluent interface.
