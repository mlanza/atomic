# Cloneable

Makes a copy of an object.  This likely signals a modification is coming.

* `clone(self)` - Returns a copy of an object.

In JavaScript arrays and objects are reference types and, thus, mutable.  In Atomic, however, they may be treated as immutables.  Use `identity` only as the implemention for `clone` for truly immutable types.  Otherwise, have it return a shallow copy.
