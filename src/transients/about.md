# Transients

In JavaScript land arrays and objects are mutable reference types.  In Atomic land they are, by default, treated as value types (immutable or persistent types) rather than reference types because no provided operation will, as a rule, mutate them.

A [transient in Clojure](https://clojure.org/reference/transients) is a mutable object, a counterpart to a persistent object, that exists for performance reasons.  But in JavaScript arrays and objects are mutable by nature.  It's by rule of law alone they're treated otherwise.

Arrays and objects which are intended for mutation are wrapped in transient containers (e.g. `TransientArray` or `TransientObject`) in order to explicitly reveal this intent.  This may seem like a lot of fuss.  It is!  If a native array or object is created and held privately by a containing object there's no reason they can't be treated as mutable data without necessitating a wrapper.  The transient wrappers provide some benefit:

* they clearly communicate the intended mutable use of the data
* they can be swapped for other transients which implement similar protocols

Transient data ought not be revealed outside the object which contains it.

The mutable protocols (e.g. `mut.conj`) are treated as commands per command-query separation.  That is, the mutable operators have no return values.  This differs from Clojure.

## Extreme Immutability
I contemplated whether all stateful objects could be rewritten as persistent objects and in many cases they can.  The drawback is they necessitate a state container and are less performant than their stateful counterpart.

I had considered if it the library could be immutables focused, but I recalled the importance of the dom and its part in app development.  The dom is one big stateful ball of mutability.  When one recognizes the need to operate against natives the notion of eliminating transient types is gone.  The transient operations must exist because stateful objects continue to exist!  And the only way to eliminate the need for transient types is to ignore stateful objects.
