* sort
* butlast
* str
* interpose
    * is there a use with compose/pipe to abort process on null?
    * to observe intermediary values passing through?
* rseq
* second
* disj
* dissoc
* distinct -- test
* memoize
* merge
* merge-with
* keys
* key
* select-keys
* every-pred -- and?
* + / plus
* - / minus
* case
* cond
* condp
* doall
* doseq
* dotimes
* drop-last
* fnil
* get-method
* group-by
* keep-indexed
* make-hierarchy (and related fns)
* map-entry?
* not= - ne
* num
* number?
* or
* partition / partition-all / partition-by
* printf
* range
* rem
* replace
* seq?
* sequence
* sequential?
* set
* sort-by
* split-at
* split-with
* string? -- unnecessary? use is(String, "")?
* time
* tree-seq
* when -- lazy (e.g. guard)
* shuffle

*eliminate recursion inefficiencies, use reduce where possible