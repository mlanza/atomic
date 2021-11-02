# Volatile

Volatiles hold state using a type whose modifying commands are queries which actually provide a replacement.  The use of a volatile gains all a type's swappable queries.  There is no need for a transient counterpart.

## Swappability

To avoid transient protocols, a volatile allows the use of `_.vswap(middleware, _.conj(_, handler))` instead of `mut.conj(middleware, handler)`.  This avoids the need for a transient when long-term performance is not a concern.  This bypasses the need to load the [atomic/transients](../../../transients) module.
