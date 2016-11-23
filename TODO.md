* update-in
* sort
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
* max
* min
* keys
* key
* last
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
* drop-while
* every?
* even? / odd?
* fnil
* get-method
* group-by
* identical?
* into-array -- toArray
* keep-indexed
* make-hierarchy (and related fns)
* map-entry?
* neg?
* pos?
* not
* not-any?
* not-every?
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
* some?
* sort-by
* split-at
* split-with
* string? -- unnecessary? use is(String, "")?
* time
* tree-seq
* when -- lazy (e.g. guard)
* zero?
* shuffle
* rand

*eliminate recursion inefficiencies, use reduce where possible