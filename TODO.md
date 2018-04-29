# TODO

* IKVReduce, reduce-kv
* review ideas in utiljs, esp. tag
* identify long-term module strategy; extract transducers; organize functions by the type they target (e.g. String, Function, etc.)
* subarr (like subvec)

# BACKLOG

* implement iterators so that Array.from can work with applicable types and toArray can use it.
* note that native Sets are mutable and giving them an immutable interface would be slow -- use immutable set lib.
* ISet + disjoin/disj, set, set?, difference, intersection, join, select, subset?, superset?, union
* Fractal components (like redux/elm)
* channels? -- reuse existing lib, but wrap api? alternately: Signals.
* Promise type protocols that suit it
* immutablejs adapter
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
* trampoline
* some->, some->>
* some-fn
* hierarchy: isa?, make-hierarchy, derive, underive, descendants, parents
* implement IMapEntry, IFind, IStack, ISorted, IIterable
* clojure.string
* atom, IWatchable
* improve structure to aid in tree shaking
* ISerialize (with an edn-like approach to deserialization)
  * different from toString
  * what about infinite recursion existing with cyclical references?
    * use a reference type that acts as a pointer?
  * use with memoize
* sequence / eduction / LazyTransformer / Stepper
* Period type
* Recurrence type - generates via lazySeq recurrences using recurrence data
