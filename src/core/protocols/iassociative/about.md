# IAssociative

Represents a random access collection of items which can be read or written by key.  A key could be almost anything but it is generally a string or a number (e.g. index).

* `assoc(self, key, value)` - Writes/overwrites a value at a given key.
* `contains(self, key)` - Does the given key exist?

Having provided a type with associativity other functions become available.

* `contains(self, key, value)` - Does a value exist at a given key?  Requires an `ILookup` implementation.
* `assoc(self, ...key/value pairs)` - Writes/ovewrites several values with given keys.
* `assocIn(self, path, f)` - Writes/overwrites a value at a location 1 or more keys deep.
* `update(self, key, f)` - Retrieves a value at a given key and transforms it with `f`.
* `updateIn(self, path, f)` - Retrieves a value at a location 1 or more keys deep and transforms it with `f`.
