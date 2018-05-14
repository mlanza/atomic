# TODO

* IEquiv, identical?
* review ideas in utiljs, esp. tag
* clojure.string
* identify long-term module strategy; organize functions by the type they target (e.g. String, Function, etc.)
* improve structure to aid in tree shaking

# BACKLOG

* note that native Sets are mutable and giving them an immutable interface would be slow -- use immutable set lib.
* ISet + disjoin/disj, set, set?, difference, intersection, join, select, subset?, superset?, union
* Fractal components (like redux/elm)
* immutablejs adapter
* inflection: 1 thief, 2 thieves -- use data structure similar to make-hierarchy
* Object protocol -- toString, equiv, indexOf, lastIndexOf
* IHash, memoize (could be based on ISerialize.  that is, if a datastructure can be represented as a string/json.)
* IReversible, reversible, reverse, rseq
* printf, format
* some->, some->>
* defmulti + hierarchy: isa?, make-hierarchy, derive, underive, descendants, parents
* implement IMapEntry, IFind, IStack, ISorted, IIterable
* atom, IWatchable
* ISerialize (with an edn-like approach to deserialization)
  * different from toString
  * what about infinite recursion existing with cyclical references?
    * use a reference type that acts as a pointer?
  * use with memoize
* sequence / eduction / LazyTransformer / Stepper
* Period type, use Range type for both numbers and dates with optional step fn?
* Recurrence type - generates via lazySeq recurrences using recurrence data
