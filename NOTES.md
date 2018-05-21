grep -R "some" --exclude-dir="*node*" .

# PRINCIPLES

* Avoid using type constructors (e.g. the keyword "new") directly.  Use the provided constructor functions.
* Avoid virtual doms.  Use a model diff/patch strategy.
* Avoid creating types where primitives will do.  A type should be introduced to vary protocol implementations.
* Avoid monads as they necessitate commitment.  Use monadic pipelines instead.
* Avoid recursion for potentially large stacks.
* Avoid writing functions that care about `this` bindings, rather pass `self` as the first argument when required.
* Avoid thinking in concrete types.  Prefer thinking in abstract types that provide behaviors.
* The Law of Abstractions: When a invoking a function against an object that returns a different representation of it, the type may vary (e.g. an Array becoming an IndexedSeq).  The new representation should abide the same protocols to maintain the integrity of the abstract type.  Apart from this, one must think in concrete types.
* A sum type is nothing but the set of types that implement a protocol.  With protocols ADTs are not necessary.
* The first argument of a protocol function is the type.
* In a `behave` module only behaviors (encapsulated effects) should be exported, not functions themselves.
* Don't offer too many permutations as seen in ramda (e.g. map, mapAccum, mapAccumRight, max, maxBy, etc.).  Rather illustrate how to use simple idioms (compositions of up to 3 functions) in place of having occasionally used functions.  The library should include only bread and butter functions (ones used more frequently).
* Consider using binary accum functions (e.g. both, either) from which to create reducing versions (and, or) of unlimited arity.
* The api documentation should offer practical examples showcasing the usefulness of a function.  I found that some popular libraries seem to include arbitrary examples that were of no help.
* Prefer pure functions
* One should avoid using the library api to act on Map and Set types.  In it's attempt to avoid mutation, it is grossly inefficient.  It exists only to allow interoperability.
* Some protocols are superseded by a public api (like ICompare and IReduce).  While the protocol can be used directly, prefer the public api when unsure of differences in use.
* There is no function for `reify` or `speficy` those both are easily possible.  Simply export a behavior and in the case of `reify` apply it to a blank object and in the case of `speficy` apply it to an existing object.