# IDispatch

Sends a command message to a single handler such as a command bus.  As a rule, a command can be cancelled, and thus prevented from happening.

* `dispatch(self, message)` — sends a message to some handler
