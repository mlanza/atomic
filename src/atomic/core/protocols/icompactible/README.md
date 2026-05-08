# ICompactible

Eliminates insignificant values from a collection.  A collection has a default notion of what's insignificant.  In a lazy sequence untruthy values are considered insignificant, for example.

* `compact(self)` - Drops insignificant values.
* `compact(self, pred)` - Drops values matching the predicate.
