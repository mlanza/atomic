# ICounted

Represents a finite collection of items whose quantity can be known.

* `count(self)` - Returns the size of the collection.

Some collections can be efficiently counted while others (e.g. lazy sequences) must be fully realized.  Thus, depending on the type, count can be an expensive operation.