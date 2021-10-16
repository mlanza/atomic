# ISubscribe

Provides an observer to a publisher.  The observer is  notified with an indefinite number of published messages.

* `sub(self, observer)` — Provides an observer to field messages and returns a function which, when invoked, will unsubscribe the observer.
* `sub(self, ...xfs, observer)` — like the simpler `sub` but provides 1 or more message transducers

The consumer or the provider must maintain some state (e.g. reference to a subscription).  There's no getting around it the subscription is eventually to be disposed of.  Originally, the provider universally handled this.  Observables shift the responsibility to the consumer.  Subjects are providers and they maintaining an internal registry of observers.  While both approaches are reasonable, what's desired is a uniform api.  Thus `unsub` is being deprecated and the consumer is obliged to dispose of a subscription when it's done with it.
