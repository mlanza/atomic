grep -R "some" --exclude-dir="*node*" .

# PRINCIPLES

* The first argument of a protocol functions is the type.
* Don't export protocol methods from types to ensure we deal with abstractions and not concrete types.
* The Law of Abstractions: Invoking a function against one concrete type can result in a different concrete type so long as the new type abides the same protocols.  In this manner, we use protocols and types to achieve a poor man's discriminated union.
* When possible replace macros with functions, otherwise omit.
* Don't offer too many permutations as seen in ramda (e.g. map, mapAccum, mapAccumRight, max, maxBy, etc.).  Rather illustrate how to use simple idioms (compositions of up to 3 functions) in place of having occasionally used functions.  The library should include only bread and butter functions (ones used more frequently).
* Consider using binary accum functions (e.g. both, either) from which to create reducing versions (and, or) of unlimited arity.
* The api documentation should offer practical examples showcasing the usefulness of a function.  I found that some popular libraries seem to include arbitrary examples that were of no help.
* It is possible to use mutation and have a pure function so long as the mutation does not leak.
* One should avoid using the library api to act on Map and Set types.  In it's attempt to avoid mutation, it is grossly inefficient.  It exists only to allow interoperability.