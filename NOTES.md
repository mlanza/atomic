# PRINCIPLES

* Avoid dependence on module organization.  The public api should be packaged under a single collective module in order to reduce the impact of reorganizations.  The organization is not yet firm.
* Construct all objects with factory functions.
* To aid REPL-driven development type properties are treated as private as a matter of discipline and not actually hidden.
* Prefer a diff/patch strategy to virtual doms (React).
* Avoid recursion which could result in stack overflows.
* Write functions in that pass `self` as the first arg (FP) over those that rely on `this` (OOP).
* Prefer abstractions and behavioral, protocol-centered thinking to caring about concrete types.
* Avoid `Object.freeze` for immutability.  Rather avoid impure functions that mutate.
* Design around a functional core (functional objects and pure functions) and an imperative shell (imperative objects).
* Use `members` to eliminate potential duplicates.  Consider that a jQuery object has this behavior.
* Understand that protocols are non-native and as such using protocols pushes all requests through a protocol lookup channel that adds overhead to requests.  Pivoting on type will always add more overhead than a method that simply branches (via `if` or `switch`) on type using simple type checks (e.g. `typeof arg == "string"`).
* In some cases, when dealing with collections (Seqs), we cannot know what concrete types it will contain.  HTMLDivElement and HTMLSpanElement are predictable HTML elements; however, developers can define their own custom elements via Web Components.  Unless the behavior/protocols for those components are defined, the api will break when it encounters these custom elements.  Protocol resolution, for performance, looks directly to the constructor and not the full inheritance chain because protocols are internally implemented using WeakMaps.  Traversing the inheritance chain on every protocol lookup would be too expensive.  That is why the dom traversal api assumes all items within the seq are elements.
* The Law of Abstractions: When a invoking a function against an object that returns a different representation of it, the type may vary (e.g. an Array becoming an IndexedSeq).  The new representation should abide the same protocols to maintain the integrity of the abstract type.  Apart from this, one must think in concrete types.
* A protocol is a contract that involves its api (commands and queries) and also its operands.  That is, the `IQueryable.query` protocol should not receive a selector string to query, in one context, the dom and a T-SQL statement, in another context, to query a database.  The contract is a dialect which is the sum of the api and its operands.
* A sum type is nothing but the set of types that abide the same protocols and a constructor that returns one of those types.  ADTs are unnecessary.
* The first argument of a protocol function is the type.
* Types are defined in terms of behaviors which are exported and can be applied to one or more types.
* Ramda offers too many slight permutations (e.g. `map`, `mapAccum`, `mapAccumRight`, `max`, `maxBy`).  Prefer a smaller api and allow permutation by simple combination.
* Consider using binary accum functions (e.g. `both`, `either`) from which to create reducing versions (`and`, `or`) of unlimited arity.
* The api documentation should offer practical examples showcasing the usefulness of a function.  I found that some popular libraries seem to include arbitrary examples that were of no help.
* Prefer JavaScripts native arrays and objects to their weightier counterparts (e.g. `Immutable Vector` and `Immutable Map`) as this also avoids importing an additional dependency.
* Prefer the public api, which may be overloaded, (e.g. `_.reduce`) to the direct use of a protocol (e.g. `IReduce.reduce`) or at least understand their differences.
* Use `IClonable.clone` in preparation for a mutation when the need arises.
* Both protocols and multimethods are just implementation details over programming interfaces.  This leaves room to change the details for performance reasons or otherwise without impacting consumers.  When possible prefer protocols to multimethods.  Furthermore, if the type provided to the second arg affects the result, either branch internally or use an exposed multimethod internally.
* Clojure offers persistent and transient objects and different protocols to effect the same operation (e.g. `assoc` v. `assoc!`).  As bang, however, is not valid in method names the distinction falls to the namespace (e.g. `_.assoc` v. `mut.assoc`).
* In observance of command-query separation, and contrary to what Clojure does, commands return void.  As an exception a command may return a (potentially promised) status signaling its outcome.
* `IDispatch` and `IPublish` are similar in that both relay messages to receivers.  The difference, however, is that dispatch is for commands and always targets a single handler while publish is for events and targets an indefinite number of listeners.  Commands can be canceled, but events cannot.
* Prefer autopartial to autocurry functions.
* Prefer to write functions that execute when invoked as opposed to those that return a partial application.  This approach suits the writing of overloaded, variadic functions.
* A variadic function that returns a partial application should generally receive only the primary operand and execute on the next call.

`grep -R "some" --exclude-dir="*node*"`
