# Transients

In JavaScript land arrays and objects are mutable reference types.  In Atomic land they are, by default, treated as value types (immutable or persistent types) rather than reference types because no provided operation will, as a rule, mutate them.

A [transient in Clojure](https://clojure.org/reference/transients) is a mutable object, a counterpart to a persistent object, that exists for performance reasons.  But in JavaScript arrays and objects are mutable by nature.  It's by rule of law alone they're treated otherwise.

Arrays and objects which are intended for mutation are wrapped in transient containers (e.g. `TransientArray` or `TransientObject`) in order to explicitly reveal this intent.  This may seem like a lot of fuss.  It is!  If a native array or object is created and held privately by a containing object there's no reason they can't be treated as mutable data without necessitating a wrapper.  The transient wrappers provide some benefit:

* they clearly communicate the intended mutable use of the data
* they can be swapped for other transients which implement similar protocols

Transient data ought not be revealed outside the object which contains it.

The mutable protocols (e.g. `mut.conj`) are treated as commands per command-query separation.  That is, the mutable operators have no return values.  This differs from Clojure.

## Extreme Immutability
Stateful objects can frequently be rewritten as persistent objects.  This choice necessitates a state container and can have performance costs.

It's not necessarily a wrong choice to make system constructs persistent.  Frequently, these constructs are configured only during system start up and then are not touched again.  The configure-and-leave-alone tack reduces the impact of performance concerns.

In some instances there is no reasonable persistent counterpart—the dom, for example.  The dom is stateful.  When one recognizes the need to operate against natives there is no eliminating impure functions.  The transient operations must exist because stateful objects exist!

And the only way to eliminate the need for impure functions is to ignore stateful objects.  Another way would be to implement a virtual dom which is itself persistent and then a diff algorithm which contains all the necessary logic for applying updates against the dom.  This would contain all effects to the patching algorithm.  The same strategy could be applied against any kind of stateful objects.

## Naming
Clojure appends an exclamation to a function name to call out mutable operations; however, JavaScript does not permit this.  Thus, rather than `_.assoc` v. `_.assoc!`, it's `_.assoc` v. `mut.assoc`.
