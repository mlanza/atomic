# Volatile

Volatiles is a state container without sub/pub.  It is uses persistent, swappable data as the basis of its statefulness.

## Swappability

To avoid dependence on a transient and its protocols (e.g. [atomic/transients](../../../transients)), a volatile allows the use of `_.vswap(middleware, _.conj(_, handler))` instead of `mut.conj(middleware, handler)`.  This is useful when, due to updates being infrequent, its performance trade-off is not a concern.
