* disj
* dissoc
* =
* not= - ne
* keep-indexed
* take-last
* fnil
* rseq
* sort
* distinct -- test
* merge
* merge-with
* select-keys
* cond
* condp
* get-method
* replace
* sequence
* sequential?
* sort-by
* split-at
* split-with
* memoize
* time
* tree-seq
* shuffle
* make-hierarchy (and related fns)
* map-entry?
* util.js and
* util.js or

*refine api/tests to mirror clojure's; create chainable api as secondary
*rewrite comparison operators (gt, lt, etc.) to be more like plus, minus
*atom (observable?)
*eliminate recursion inefficiencies using reduce or loop or laziness
*thread-first, thread-last
*pipe that breaks on null
*pipe that sends intermediary values passing through to log or other effect
*channels? -- reuse existing lib, but wrap api?

MAYBE SOMEDAY
* doseq
* printf