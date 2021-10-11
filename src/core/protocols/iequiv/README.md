# IEquiv

Represents an type which can be compared against another for content equivalence.

* `equiv(self, other)` - Indicates whether the types are the same.

Two objects could be identical in content but would not be considered equal (`===`) by JavaScript standards (because they occupy different locations in memory).  The comparison exists in order to compare objects on the basis of their content and not their in-memory identity.  Obviously, however, two references to the same memory address are equivalent.