# TODO

* IReset, ISwap, atom, swap!, reset!
* IWatchable
* Signal type like traffic
* IKVReduce, reduce-kv

# BACKLOG

* note that native Sets are mutable and giving them an immutable interface would be slow -- use immutable set lib.
* ISet + disjoin/disj, set, set?, difference, intersection, join, select, subset?, superset?, union
* review ideas in utiljs, esp. tag.
* organize functions by the type they target (e.g. String, Function, etc.)
* Fractal components (like redux/elm)
* channels? -- reuse existing lib, but wrap api? alternately: Signals.
* Promise type protocols that suit it
* immutablejs adapter
* transducers use reducers in an attempt to avoid having to redesign apis for sequences of different types.  the problem is a reducer considers the accumulator (memo) and the potential new addition (filter = potential).  I wonder if there is a simpler concept at play: "the potential value".  A stream is potentially infinite.  the question is how do we use transducers with signals?
* how much `this` context passing (e.g. f.call(this, a, b, c)) is necessary to keep bindings intact? -- N/A.
* defmulti
* inflection: 1 thief, 2 thieves -- use data structure similar to make-hierarchy
* Object protocol -- toString, equiv, indexOf, lastIndexOf
* IEquiv, identical?
* IHash, memoize (could be based on ISerialize.  that is, if a datastructure can be represented as a string/json.)
* IReversible, reversible, reverse, rseq
* time
* shuffle
* doseq
* rand
* printf, format
* subarr (like subvec)
* trampoline
* sequence / eduction / LazyTransformer / Stepper
* some->, some->>
* some-fn
* hierarchy: isa?, make-hierarchy, derive, underive, descendants, parents
* eliminate recursion inefficiencies using reduce or loop or laziness or trampoline
* implement IMapEntry, IFind, IStack, ICloneable, ISorted, IIterable, IRecord
* add count property as optimization to List (not LazyList)
* clojure.string
* improve structure to aid in tree shaking
* ISerialize (with an edn-like approach to deserialization)
  * different from toString
  * what about infinite recursion existing with cyclical references?
    * use a reference type that acts as a pointer?
  * use with memoize