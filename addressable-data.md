# Addressable Data

Functional programming relies on addressable data.  Instead of having lots of objects each containing bits of data, a program/component stores its state in a single state container.  And since most programs deal in dozens of entities and disparate concepts, the state held in the container will usually be a structured, mashup of lots of things.

The developer, having devised that structure, will have a strategy for querying and updating it.  In some respects, he will select and update as he would any large structure (e.g. the DOM).  This is made possible through Clojure's protocols for querying, updating and overwriting data.

* [`get`](https://clojuredocs.org/clojure.core/get) — read a property
* [`update`](https://clojuredocs.org/clojure.core/update) — update a property
* [`updateIn`](https://clojuredocs.org/clojure.core/update-in) — update given a path
* [`assoc`](https://clojuredocs.org/clojure.core/assoc) — overwrite a property
* [`assocIn`](https://clojuredocs.org/clojure.core/assoc-in) — overwrite given a path

With just a handful of functions, he surgically updates the data held in the container.

With Atomic functions, the names which match Clojure functions are usually the functional equivalent of Clojure's.  This means one can usually use the Clojure documentation to understand what a function does.

Like Clojure, addressable data is replaced via a succession of [swap!](https://clojuredocs.org/clojure.core/swap!) operations.

```js
const $state = $.cell(/* real estate data */);
$.swap($state, _.assocIn(_, ["property-manager", "address", "street"], "101 Boardwalk Place"));
const condo = _.chain($state, _.deref, _.get(_, "condos"), _.detect(_.comp(_.gte(_, 500000), _.get(_, "price")), _));
$.swap($state, _.updateIn(_, ["condos", condo, "price"], _.mult(_, .9))); //offer 10% discount
$.swap($state, _.assoc(_, "last-modified", _.date()));
```
