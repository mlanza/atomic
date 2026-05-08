# IActor

Represents an actor which receives and processes commands.

* `act(self, command)` - receives an intention which may be actuated or rejected.
* `actuate(self, event)` - receives an event and folds it into the state.
* `undone(self, event)` - can the event be undone?
* `events(self)` - returns all known events

The `undone` check isn’t about realtime undo/redo — that’s what [journals](../../types/journal/) handle. It’s about reversibility as a system-level feature: can the user ask the system to roll this action back? Keep in mind that as more actions accumulate, something reversible now may later become irreversible. Events—often logged in the backend—record an `undoable` flag to track this capability.

See [Make It Act](../../../../docs/make-it-act.md) for further details.
