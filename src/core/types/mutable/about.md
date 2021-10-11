# Mutable

By default all objects, even the native object and array, are treated as immutables.  Therefore, when an actual mutable object or array is needed, they can be of the transient variety.  This requires "atomic/transients" to be loaded.

For a less expensive alternative, such objects can be encased in the `mutable` wrapper.  This wrapper is used to explicity highlight the intended mutable use as apart from it the rule of law is don't mutate objects.  The `mutate` function is used to explicitly highlight mutable actions.
