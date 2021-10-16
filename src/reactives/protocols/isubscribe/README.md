# ISubscribe

Provides an observer to a publisher.  The observer is notified with an indefinite number of published messages.

* `sub(self, observer)` — Provides an observer to field messages and returns a function which, when invoked, will unsubscribe the observer.
* `sub(self, ...xfs, observer)` — like the simpler `sub` but inserts 1 or more transducers between the source and sink.

There once was a corresponding `unsub` api.  It wasn't much used.  In practice reactives were created once during setup and kept for the life of the page.  The clean-up step wasn't needed and there were no memory leaks.

The `unsub` option still remains but it is now returned from `sub`. There were some trade-offs to this decision.

First, when the callback acts as the key for both `sub` and `unsub` there is no need to hold the `unsub` dispensed by `sub`.  The original callback was usually held in a closure somewhere and required no additional overhead to track.  However, unsubscribing won't always be a major concern.  If it is, the parent object which created the subscription can handle the unsubscribing.

Second, the `sub` function is actually a command and in keeping with command-query separation would ordinarily not return a value.  As this return value can often be ignored anyway, this was a minor compromise.
