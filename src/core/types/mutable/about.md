# Mutable

By default all objects, even the native object and array, are treated as immutables.  Therefore, when an actual mutable object or array is needed, they can be of the transient variety.  The [atomic/transients](../../../transients) module must be loaded.

For a less expensive alternative, such objects can be encased in a `mutable` wrapper.  The wrapper explicity highlights the intended mutable use as apart from it the rule of law is to not mutate objects.  The `mutate` function explicitly highlights mutations.

The mutable should be privately held by the type which contains and operates against it.  Because mutations are effected against a known concrete type, the containing type must ensure the type of the concrete mutable object.  If the dependency is passed in, it must be checked or coerced.

Mutables are not observable so observability, if desired, must be provided by other means.

The reasons to sometimes use/contain mutable objects:

* Operations may perform better
* Stateful object has edited-in-place state anyway
* All queries/commands are readily available without further implementation (e.g. `_.conj` not `mut.conj`)

There are similar reasons for using [transient types](../../../transients/about.md).

## Swappability
To avoid transient protocols, a stateful object might reasonably implement  `ISwap`.  Then instead of `mut.conj(middleware, handler)`, `_.swap(middleware, _.conj(_, handler))` is called.  The state container conceals mutation behind a swap.
