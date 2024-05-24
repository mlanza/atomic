# Volatile

Volatiles is a state container without sub/pub.  It is uses persistent, swappable type as the basis of keeping its state.

## Swappability

A volatile allows the use of `_.vswap(middleware, _.conj(_, handler))` instead of `$.conj(middleware, handler)`.  This is useful when, due to updates being infrequent, its performance trade-off is not a concern.
