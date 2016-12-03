# TODO

* disj
* organize functions by the type they target (e.g. String, Function, etc.)

# SOMEDAY

* ramda for many functions shows impractical examples of each fn in the docs.  i would rather share interesting use cases in the documentation to illustrate the usefulness of the fn.
* how much `this` context passing (e.g. f.call(this, a, b, c)) is necessary to keep bindings intact?
* break each function into its own file?
* ramda has too many permutations (e.g. map, mapAccum, mapAccumRight, max, maxBy, etc.)
  * rather than include permutations, provide recipes to illustrate the use of idioms without additional functions -- remember the guideline is a function's leverage should be strong for inclusion in the library, it is otherwise an idiom.
* create `maybe`/`opt` like functions that deal in promises (e.g. `then`) and returns any value as a promise.
* consider using accum functions (e.g. both, either) in order to create reducing versions (and, or) of unlimited arity.
* defmulti
* inflection: 1 thief, 2 thieves
* Object protocol -- toString, equiv, indexOf, lastIndexOf
* improve structure to aid in tree shaking
* ISerialize (with an edn like approach to deserialization)
  * different from toString
  * what about infinite recursion existing with cyclical references?
    * use a reference type that acts as a pointer?
* trampoline
* map-entry?
* time
* shuffle
* doseq
* printf
* tree-seq
* sequence
* eduction / LazyTransformer / Stepper
* make-hierarchy, et al...
* eliminate recursion inefficiencies using reduce or loop or laziness or trampoline
* immutablejs adapter
* channels? -- reuse existing lib, but wrap api?
* implement IHash, ISorted, IIterable, ISequential, IFn.invoke, IRecord
* add count property as optimization to List (not LazyList)
* zipmap
* random-sample
* clojure.string
* diff