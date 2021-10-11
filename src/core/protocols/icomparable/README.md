# IComparable

Provides a basis for determining the relative position of items as needed for ordering.  The implementation of a comparator must return zero (for equality), a negative number (for a lesser value), or a positive number (for a greater value).

* `compare(self, other)` - Returns a number indicating the relative position of two items.

Implementing `compare` makes a collection of a type sortable.