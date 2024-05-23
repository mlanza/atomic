# IPublish

Send a message to the system.  It will be received by `n` subscribers where `n` could be 0, 1 or more.

* `pub(self, message)` — publishes a message to any interested observers
* `err(self, error)` — sends the terminating error
* `complete(self)` — indicates a conclusion has been reached