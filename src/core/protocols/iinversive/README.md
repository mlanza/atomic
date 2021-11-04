# IInversive

Represents an object/value which has a known diametric opposite, a cancelling effect.  Two things which are merged, combined, or otherwise reduced will cancel each other out if one if the inverse of the other.
In accounting, a reversing entry.

* `inverse(self)` - Returns a diametric opposite.

+9 is the inverse of -9 and when reduced by addition result in 0.  The inverse of an inverse is equivalent to the initial value.  (e.g. `IEquiv.equiv(inverse(inverse(x)), x)`)
