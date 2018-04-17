# TODO

* Signal type (based on Observable but as a reaction, no exposed input channel)
  * research scheduler
  * use transducer with signal?  would rather create signals from transducers than to have to create `map` signal, `filter` signal, etc.
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

# API

* +
* -
* *
* /
* assoc
* assoc-in
* associative
* atom
* boolean
* boolean?
* coll?
* cat
* compare
* concat
* conj
* cons
* constantly
* contains?
* count
* counted?
* cycle
* dec
* decimal
* dedupe
* deref
* derive
* descendants
* disj
* dissoc
* distinct
* distinct?
* doto
* drop
* drop-last
* drop-while
* empty
* empty?
* even?
* every-pred
* every?
* filter
* filterv
* find
* first
* flatten
* float
* float?
* fn?
* fnil
* format
* get
* get-in
* group-by
* hash
* identical?
* identity
* inc
* indexed?
* instance?
* int
* int?
* integer?
* interleave
* interpose
* into
* into-array
* isa?
* iterate
* juxt
* keep
* keep-indexed
* key
* keys
* last
* lazy-seq
* long
* make-hierarchy
* map
* map?
* map-indexed
* mapcat
* mapv
* max
* max-key
* memoize
* merge
* merge-with
* min
* min-key
* mod
* neg?
* next
* nil?
* not
* not-any?
* not-empty
* not-every?
* not=
* nth
* num
* number?
* odd?
* parents
* partial
* partition
* partition-all
* partition-by
* pop
* peek
* pos?
* rand
* range
* reduce
* reduce-kv
* reduced
* reduced?
* reductions
* reify
* rem
* remove
* repeat
* repeatedly
* replace
* rest
* reverse
* reversible?
* rseq
* satisfies?
* second
* select-keys
* seq
* seq?
* seqable?
* sequential?
* set
* set?
* some
* some->
* some->>
* some-fn
* some?
* sort
* sort-by
* split-at
* split-with
* str
* string?
* subs
* subvec
* swap!
* take
* take-last
* take-nth
* take-while
* transduce
* update
* update-in
* to-array
* val
* vals
* vec
* vector
* vector?
* zero?
* <
* >
* <=
* >=
* =
* ==
* set operations: difference, intersection, join, select, subset?, superset?, union


# SOMEDAY

* transducers use reducers in an attempt to avoid having to redesign apis for sequences of different types.  the problem is a reducer considers the accumulator (memo) and the potential new addition (filter = potential).  I wonder if there is a simpler concept at play: "the potential value".  A stream is potentially infinite.  the question is how do we use transducers with signals?
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