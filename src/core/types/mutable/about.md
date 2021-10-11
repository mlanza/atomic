# Mutable

By default all objects, even the native object and array, are treated as immutables.  Therefore, when an actual mutable object or array is needed, they can be of the transient variety.  This requires "atomic/transients" to be loaded.

For a less expensive alternative, such objects can be encased in the `mutable` wrapper.  This wrapper is used to explicity highlight the intended mutable use as apart from it the rule of law is don't mutate objects.  The `mutate` function is used to explicitly highlight mutable actions.

The mutable should be privately held by the type which contains and operates against it.  Because mutations are effected against a known concrete type, the containing type must ensure the type of the concrete mutable object.  If the dependency is passed in, it must be checked or coerced.
