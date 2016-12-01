# TODO

* refine api/tests to mirror clojure's; create chainable api as secondary
* atom (observable?) -- all its protocols
* matches (e.g. underscorejs)

# SOMEDAY

* defmulti
* Object protocol -- toString, equiv, indexOf, lastIndexOf
* ISerialize (with an edn like approach to deserialization)
  * different from toString
  * what about infinite recursion existing with cyclical references?
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