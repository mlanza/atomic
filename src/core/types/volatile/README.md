# Volatile

Volatiles is a state container without sub/pub.  It is uses persistent, swappable data as the basis of its statefulness.

## Swappability

To avoid dependence on shell protocols (e.g. [atomic/shell](../../../shell)), a volatile allows the use of `_.vswap(middleware, _.conj(_, handler))` instead of `$.conj(middleware, handler)`.  This is useful when, due to updates being infrequent, its performance trade-off is not a concern.
