# TODO

* examine other apis: ramda, underscore, sugar
* set fns: intersection, superset, difference, union, disj

# SOMEDAY

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
* add count property to List (not LazyList)
* zipmap
* random-sample
* clojure.string
* diff