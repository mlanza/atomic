# IPublish

Send an event message as a broadcast to `n` subscribers where `n` could be 0, 1 or more.  As a rule, events cannot be cancelled, since they signal what actually happened.

* `pub(self, message)` — publishes a message to any interested observers
* `err(self, error)` — sends the terminating error
* `complete(self)` — indicates a conclusion has been reached
