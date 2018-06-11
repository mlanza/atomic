grep -R "some" --exclude-dir="*node*" .

# PRINCIPLES

* Avoid dependence on module organization.  The public api should be packaged under a single collective module in order to reduce the impact of reorganizations.  The organization is not yet firm.
* Avoid `curry` except in the pointfree export where partial application takes center stage.
* Avoid using type constructors (e.g. the keyword "new") directly.  Use the provided constructor functions.
* Avoid virtual doms.  Use a model diff/patch strategy.
* Avoid creating types where primitives will do.  A type should be introduced to vary protocol implementations.
* Avoid monads as they necessitate commitment.  Use monadic pipelines instead.
* Avoid recursion for potentially large stacks.
* Avoid writing functions that care about `this` bindings, rather pass `self` as the first argument when required.
* Avoid thinking in concrete types.  Prefer thinking in abstract types that provide behaviors.
* Avoid `Object.freeze` for immutability.  Rather avoid impure functions that mutate.
* Avoid statically-typed code (i.e. TypeScript) as this library reflects the dynamic typing of Clojure/ClojureScript.
* Avoid creating mutable types outright.  Prefer creating immutable types.  Put them in an atoms or create mutable types that wrap the immutable to expose a mutable api.  The latter is not the same as simply using an atom as it avoids the need to swap and deref.
* Understand that protocols are non-native and as such using protocols pushes all requests through a protocol lookup channel that adds overhead to requests.  Pivoting on type will always add more overhead than a method that simply branches (via `if` or `switch`) on type using simple type checks (e.g. `typeof arg == "string"`).
* In some cases, when dealing with collections (Seqs), we cannont know what concrete types it will contain.  HTMLDivElement and HTMLSpanElement are predictable HTML elements; however, developers can define their own custom elements via Web Components.  Unless the behavior/protocols for those components are defined, the api will break when it encounters these custom elements.  Protocol resolution, for performance, looks directly to the constructor and not the full inheritance chain because protocols are internally implemented using WeakMaps.  Traversing the inheritance chain on every protocol lookup would be too expensive.  That is why the dom traversal api assumes all items within the seq are elements.
* The Law of Abstractions: When a invoking a function against an object that returns a different representation of it, the type may vary (e.g. an Array becoming an IndexedSeq).  The new representation should abide the same protocols to maintain the integrity of the abstract type.  Apart from this, one must think in concrete types.
* A protocol is not just a set of named functions, but a contract.  The semantics of the protocol include the messages provided.  For example, it would not make sense to define an IQuery protocol that in the dom takes a CSS selector string and against a repo takes a T-SQL string.  While the shape of the function call is identical, the semantics are not.  These would be two different protocols: ICSSQuery and ISQLQuery even if both offered an identically-named `query` verb.
* A sum type is nothing but the set of types that implement a protocol.  With protocols ADTs are not necessary.
* The first argument of a protocol function is the type.
* In a `behave` module only behaviors (encapsulated effects) should be exported, not functions themselves.
* Don't offer too many permutations as seen in ramda (e.g. map, mapAccum, mapAccumRight, max, maxBy, etc.).  Rather illustrate how to use simple idioms (compositions of up to 3 functions) in place of having occasionally used functions.  The library should include only bread and butter functions (ones used more frequently).
* Consider using binary accum functions (e.g. both, either) from which to create reducing versions (and, or) of unlimited arity.
* The api documentation should offer practical examples showcasing the usefulness of a function.  I found that some popular libraries seem to include arbitrary examples that were of no help.
* Prefer pure functions
* JavaScript models structured data primarily with two constructs: Arrays and Objects.  Arrays provides a series of things (ISequential).  Objects provide descriptions of things and are like dictionaries except the keys are always strings (IDescriptive).  ISequential is a promise that a thing contains a series of other things.  Neither of protocol promises order.
* One should avoid using the library api to act on Map and Set types.  In it's attempt to avoid mutation, it is grossly inefficient.  It exists only to allow interoperability.
* Pipelines wrap each fn to maintain a context throughout the computation then exit the context.  It would be possible to wrap the fns used for use that is independent of the pipeline; however, this puts each fn in a lifted context when what we're after is vanilla fns that can be used apart from any context if desired.
* Some protocols are superseded by a public api (like ICompare and IReduce).  While the protocol can be used directly, prefer the public api when unsure of differences in use.
* It would seem that ICloneable is superfluous in a library espousing immutable values since you could simply pass everything by reference.  We should assume that any desire to clone, therefore, implies a desire to mutate, so unless the value itself (as in Immutable.js) is actually immutable, produce a clone.
* Both protocols and multimethods are just implementation details over programming interfaces.  This leaves room to change the details for performance reasons or otherwise without impacting consumers.  When possible prefer protocols to multimethods.  Furthermore, if the type provided to the second arg affects the result, either branch internally or use an exposed multimethod internally.
* Presently there are no mutable variants of fn (e.g. `assoc` vs `assoc!`); rather, the all fns prefer the avoidance of mutation (e.g. even against arrays and objects) except where mutation is the point of the type.  You can always fallback to JavaScript itself to effect a mutation that would not happen with library functions.  Alternately, I could create transient types (e.g. `TransientObject` and `TransientArray`) and constructors (`tobject` and `tarray`) to avoid having to fall out of the library and back to JavaScript itself.