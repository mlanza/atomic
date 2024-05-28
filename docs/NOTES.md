# PRINCIPLES
* Treat data as immutable.  Write pure functions.
* Command-query separation is good pratice for writing functions.  Prefer return-nothing to return-something commands.
* The modules as exported in `dist` is the api.  The internal structure may be freely reorganized.
* Prefer constructing objects using factory functions over the use of `new` since constructors should be nothing more than propery assignments.  The factory functions, and there can be many per type, perform any necessary work.
* To aid REPL-driven development type properties are treated as private as a matter of discipline and not actually hidden.
* Prefer a diff/patch strategy to virtual doms (React).
* Avoid recursion since it can result in stack overflows.
* Prefer the public api to the direct use of protocols (e.g. `_.reduce` over `IReduce.reduce`) as these are not necessarily equivalent.
* Prefer functions (with `self` as the first arg) over methods.
* Prefer abstractions and behavioral, protocol-centered thinking to caring about concrete types.
* Break programs down into a functional core and an imperative shell, 2 modules at minimum.
* Clojure's functional api is more practical than Ramda's.  Ramda has too many slight permutations (e.g. `map`, `mapAccum`, `mapAccumRight`, `max`, `maxBy`).  It's better to provide a smaller api and use typical compositions when the need arises than to export all the permutations of those compositions.
* The use of protocols adds a layer of indirection and imposes a small cost over calling concrete type-specific functions, but gaining the generality and simplified api makes it worth it.
* In some cases, when dealing with collections (Seqs), we cannot know what concrete types it will contain.  HTMLDivElement and HTMLSpanElement are predictable HTML elements; however, developers can define their own custom elements via Web Components.  Unless the behavior/protocols for those components are defined, the api will break when it encounters these custom elements.  Protocol resolution, for performance, looks directly to the constructor and not the full inheritance chain because protocols are internally implemented using WeakMaps.  Traversing the inheritance chain on every protocol lookup would be too expensive.  That is why the dom traversal api assumes all items within the seq are elements.
* The Law of Abstractions: When a invoking a function against an object that returns a different representation of it, the type may vary (e.g. an Array becoming an IndexedSeq).  The new representation should abide the same protocols to maintain the integrity of the abstract type.  Apart from this, one must think in concrete types.
* A protocol is a contract that involves its api (commands and queries) and also its operands.  That is, the `IQueryable.query` protocol should not receive a selector string to query, in one context, the dom and a T-SQL statement, in another context, to query a database.  The contract is a dialect which is the sum of the api and its operands.
* ADTs and protocols are means of polymorphism.  The former gains compile time type checking, the latter extensibility.
* The first argument of a protocol is the subject whose type determines the behavior.
* Types are defined in terms of behaviors which are exported and can be applied to one or more types.
* Consider using binary accum functions (e.g. `both`, `either`) from which to create reducing versions (`and`, `or`) of unlimited arity.
* The api documentation should offer practical examples showcasing the usefulness of a function.  I found that some popular libraries seem to include arbitrary examples that were of no help.
* Prefer JavaScripts native arrays and objects, treated as immutables, to vectors/maps at the cost of importing another library.
* Faux commands are actually queries which return replacement objects rather than mutating the passed-in objects directly.  They can be used (along with a state container) to simulate change before actualizing it.  The `ICloneable.clone` provides a means to writing these functions.
* Prefer writing protocols to multimethods.
* Treat all operations as functions be they functions, protocols, or multimethods.  Each is just a flavor of the function interface with different implementation details.
* `IDispatch` and `IPublish` are similar in that both relay messages to receivers.  The difference, however, is that dispatch is for commands and always targets a single handler while publish is for events and targets an indefinite number of listeners.  Commands can be canceled, but events cannot.
* Prefer explicit partial application (`e.g. const double = mult(2, ?)`) to self currying.  The former is more flexible and permits variadic, overloaded functions.  It is usually better to permit the manner of partial application to be specified at the call site than to bake it directly into the function.
