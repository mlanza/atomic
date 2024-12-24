# Functions over methods

Prefers function over methods because they:

* compose
* are first class (e.g., they go everywhere)
* minimize the need to bind or reference `this`
* may actually be multimethods or protocols

That last deserves some explanation.  The true nature of a function may be unknown.  It may be a function, or a multimethod, or one operation for some protocol.  Take "function," wherever it appears, to potentially be any of these.  This makes all of them first class and interchangeable.

## Guidance for writing functions

Some additional considerations for functions are they:

* can take `self` as a parameter (usually the first) as an alternative to `this`
* should use recursion sparingly due to the potential for a stack overflow
* can be overloaded (via `overload`, see `journal` and `dow` below)
* are the preferred means to instantiating objects (thus hiding `new` from the type consumer)

## Instantiating objects
The strategy for creating instances of a type are:

* The module providing a type calls `new` in the factory function(s) it exports
* The module consuming a type calls the provided factory function(s)
* A constructor function does nothing more than assign arguments to properties
* A factory function performs whatever work is necessary to instantiate an object of a type
* All properties are declared as public but treated as private

While consideration was given to using the class syntax added to the language well after Atomic was created to gain truly private properties, the idea was abandoned as ill suited to the functional paradigm.

Classes must define methods to access private properties.  Since Atomic prefers functions, all methods must be unbound as functions.  `unbind` conveniently does this.  Calling these unbound functions, however, suffers a performance hit that calling the functions deliberately written for use with a type do not.  Thus, working from classes adds overhead.

Rather privacy remains a matter of discipline.  All properties are public but treated as private.  There's no need to prefix property names with underscores.  Use `fname` instead of `_fname`.  Except with plain objects, properties are not to be accessed directly.  Use functions to encapsuate access.

See how the discussed principles are demonstrated in the code snippets to follow.

```javascript
//constructor function
function Journal(pos, max, history, state){
  this.pos = pos;
  this.max = max;
  this.history = history;
  this.state = state;
}

function journal2(max, state){
  return new Journal(0, max, [state], state);
}

function journal1(state){
  return journal2(Infinity, state);
}

//its overloaded factory function
const journal = overload(null, journal1, journal2);
```

## Implementing concrete behaviors

Concrete functions are implemented to interact with a single known type.

Here the day of the week function exists only for dates:

```javascript
function dow1(self){
  return self ? self.getDay() : null;
}

function dow2(self, n){
  return self ? dow1(self) === n : null;
}

//an overloaded concrete function
const dow = overload(null, dow1, dow2);

//using it against its one known type
const now = _.date();
const day = dow(now);
```

## Implementing abstract behaviors

[Abstract thinking](./abstraction-thinking.md) closely relates to protocols which provide the foundation by which an indefinite number of types can abide some behavior.  If a type can have a behavior, there must be a way of imbuing it.

Here `Journal` behavior associated with the `IDeref`, `IFunctor` and `IRevertible` protocols is composed or packaged as a `behave` function:

```javascript
//package the facets of a behavior...
const behave =
  does(
    implement(IDeref, {deref}),
    implement(IFunctor, {fmap}),
    implement(IRevertible, {undo, redo, /*...*/}));

//...and applying it to a constructor.
behave(Journal);
```
By first packaging the behavior, it can be readily applied to choice constructors.  This is useful for [cross-realm patching](./cross-realm-operatility.md) and for composing behaviors and for applying them to still other types.

If none of that is needed, what was done in 2 steps could be done in 1:

```javascript
doto(Journal, //apply behavior directly
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}),
  implement(IRevertible, {undo, redo, /*...*/}));
```

When creating new types, one ordinarily considers and implements both its concrete functions and its abstract functions.  These are, respectively, the behaviors which are and which are not exclusive to the type.

When creating new behaviors they will ordinarily begin as concrete functions for a single known type.  When it is discovered the behavior applies to other types, they can be promoted into abstract functions, the kind that define protocols.  The generality is things begin in the concrete and, only when needed, move toward abstraction.
