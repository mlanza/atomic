# ICollection

Represents a collection of items.

* `conj(self, item)` - grows the collection by one item
* `conj(self, ...items)` - grows the collection by several items
* `unconj(self, item)` - shrinks the collection by one item
* `unconj(self, ...items)` - shrinks the collection by several items

This difference with `ICollection` as compared to `IAppendable` or `IPrependable` is it makes no guarantees about the relative position of newly added items.  If the relative position of additions is unimportant, prefer `conj` as the other operations may be more expensive.