# IHashable

Allows a type to provide hash codes.  This allows both reference types and values types to be hashed.  The hashing algorithm is borrowed from Immutable.js.  Atomic imbibes the philosophy that native objects and arrays be treated as value objects and one has to explicitly break away from it.  This is effected in the integration.

This requires a separate instance of Immutable.js be used if some external code uses the common approach of objects and arrays being reference types.

`hash(self)` — returns a hashcode

Hashing makes no guarantee that two dissimilar objects won't sometimes return the same hash code.  It will ordinarily be used in tandem with equivalence testing.  Thus, type which implements `IHashable` will also implement [`IEquiv`](../iequiv).  When an object is used for keyed access to a mappable type the mappable's internals will use equivalence checks to resolve any accidental hits.  This is demonstrated in the implementation of [`Multimethod`](../../types/multimethod).
