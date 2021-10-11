# IMergable

Provides a lossy means of combining objects which share similar or identical behavior and/or interface.

* `merge(self, other)` — combines two things
* `merge(self, ...others)` — this comes free when implementing the above.

There is guaranteed operation for separating what's been combined.  Thus, "lossy" means the distinctness of the parts may be lost.  The operation should generally be considered irreversible.