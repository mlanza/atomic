# TODO

* Signal type (based on Observable but as a reaction, no exposed input channel); research scheduler
* Component type (fractal, see redux/elm) -- avoid mutating side effects
* Virtual DOM
* organize functions by the type they target (e.g. String, Function, etc.)
* review ideas in utiljs.
* consider data types -- native types vs immutable types (in immutable.js)
  * protocols surrounding Map and Set are terribly inefficient and should probably be dropped altogether unless these are treated as transients; however, I don't want to support transients out of the box.  Both can be used internally but should not be exposed.
* ISerialize (with an edn like approach to deserialization)
  * different from toString
  * what about infinite recursion existing with cyclical references?
    * use a reference type that acts as a pointer?
  * use with memoize

# SOMEDAY

* how much `this` context passing (e.g. f.call(this, a, b, c)) is necessary to keep bindings intact?
* break each function into its own file?
* defmulti
* inflection: 1 thief, 2 thieves
* Object protocol -- toString, equiv, indexOf, lastIndexOf
* improve structure to aid in tree shaking
* trampoline
* create Reducer type for use with `transducer` instead of `overload` fn?  Benefits worthwhile?
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
* Promise type protocols that suit it
* channels? -- reuse existing lib, but wrap api? alternately: Signals.
* implement IHash, ISorted, IIterable, ISequential, IFn.invoke, IRecord
* add count property as optimization to List (not LazyList)
* clojure.string