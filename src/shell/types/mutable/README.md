# Mutable

By default all objects, even the native object and array, have mutable/immutable protocols for handling operations using a consistent api.  In some instances one may wish to use a type apart from this api.  The mutable wrapper explicitly highlights the mutating of the inner concrete type.  The operation itself may involve anything even calling methods on the instance.

The primary reason to wrap a reference type is to permit mutation against the type, instead of using a state container and the more expensive copy-on-write overhead of swapping.  [Volatiles](./../volatile) are an alternative to mutables which allow persistent types to be swapped in place like atoms.
