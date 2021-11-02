# Mutable

By default all objects, even the native object and array, are treated as immutables.  All the common protocols assume this.  Therefore, when an actual mutable object or array is needed, they need be markedly transient and utilize the transient protocols.

For a less expensive alternative, such objects can be encased in a `mutable` wrapper.  The `mutate` explicitly highlights when the state is mutated.

The mutable should be privately held by the type which contains and operates against it.  Because mutations are effected against a known concrete type, the containing type must ensure the type of the concrete mutable object.  If the dependency is passed in, it must be checked or coerced.

The primary reason to use a mutable is the performance gained when the copy-on-write overhead is avoided.  [Volatiles](./../volatile) are an alternative to mutables which allow persistent types to be swapped in place like atoms.  They provide in-place state change.

There are similar reasons for using [transient types](../../../transients).
