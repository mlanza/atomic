# IActor

Represents an actor which receives and processes commands.

* `act(self, command)` - receives an intention which may be actuated or rejected.
* `actuate(self, event)` - receives an event and folds it into the state.
* `undone(self, event)` - can the event be undone?
* `events(self)` - returns all known events
* `glance(self)` - returns effects accumulated for external actors, but not yet drained
* `drain(self)` - returns the actor without the effects

The actor set up during dependency injection determines how commands are processed and whether the component (what it does during `act`) is pure or impure.  The potential for side effects exists.
