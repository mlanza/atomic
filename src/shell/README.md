# Transients

In JavaScript arrays and objects are mutable reference types.  In Atomic they are, by default, treated as immutable, value types rather than mutable, reference types and the standard protocols don't, as a rule, mutate.  The [transient protocols](../transients) treat these types like the mutables they are.

As a rule, when one creates an object and assigns it to a var, to avoid confusing its purpose, it must be held as mutable or immutable, and the appropriate protocols/functions used.  For example, `_.conj` treats an array as a value type, returning a replacement array.  It, thus, acts as a query where command-query separation is concerned.  It would likely be held in a state container.  And `mut.conj` treats an array as a reference type, and mutates it in place.  It, thus, acts as a command.

The array would be treated as an immutable in the functional core of an app and as a mutable in the imperative shell.  Same type, but depending on where it lives, it may be used one way or the other.

## Naming

Clojure appends exclamations to function names to call out mutable operations; however, JavaScript does not permit this.  Thus, rather than `_.assoc` and `_.assoc!`, it's `_.assoc` and `mut.assoc` depending on the module it is imported from.
