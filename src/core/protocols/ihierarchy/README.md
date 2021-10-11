# IHierarchy

Represents a traversable hierarchy with a root, braches, and leaves.

* `root(self)` - Returns the root of the hierarchy.
* `parent(self)` - Returns the parent of the element.
* `parents(self)` - Returns the parents, grandparents, etc. of the element.
* `closest(self)` - Returns the first parent matching a condition.
* `children(self)` - Returns the ordered children of an element.
* `descendants(self)` - Returns the children, grandchildren, etc. of the element.
* `siblings(self)` - Returns the siblings of an element.  The order should be consistent.
* `nextSibling(self)` - Returns the next sibling of an element or null.
* `nextSiblings(self)` - Returns a collecting of next siblings of an element.
* `prevSibling(self)` - Returns the previous sibling of an element or null.
* `prevSiblings(self)` - Returns a collecting of previous siblings of an element.

All of the above have default implementations if `parent` and `children` are provided.  Supply only more efficient implementations.
