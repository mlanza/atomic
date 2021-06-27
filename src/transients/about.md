# Transients

In JavaScript land arrays and objects are mutable reference types.  In Atomic land they are, by default, treated as value types (immutable or persistent types) rather than reference type because no provided operation will, as a rule, mutate them.

A [transient in Clojure](https://clojure.org/reference/transients) is a mutable object that exists primarily for performance reasons.  But in JavaScript arrays and objects are already transients.  It's only by rule of law they're treated otherwise.

Arrays or objects that are available for mutation are wrapped (with `TransientArray` or `TransientObject`) in order to reveal their intended use.  This may seem like a lot of fuss.  It is!  If a native array or object is created and held privately by a containing object there's no reason it couldn't be mutated (treated as a transient) without the wrapper.  The transient wrappers exist only for non-private objects.  They were created elsewhere and passed in or they're otherwise exposed.  In such a situation a transient (array or object) may be passed around as an abstract type with a behavior and api and, in this situation, necessitating the wrapper makes sense.
