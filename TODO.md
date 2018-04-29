# TODO

* IDispose (add to `duct`)
* signal tests
* ICloneable
* IRecord -- remove Record type
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
* transducers use reducers in an attempt to avoid having to redesign apis for sequences of different types.  the problem is a reducer considers the accumulator (memo) and the potential new addition (filter = potential).  I wonder if there is a simpler concept at play: "the potential value".  A stream is potentially infinite.  the question is how do we use transducers with signals?
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
* eliminate recursion inefficiencies using reduce or loop or laziness or trampoline
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
* Recurrence - generates via lazySeq recurrences using recurrence data
