# Functions over methods

Prefers function over methods because they:

* compose
* are first class (e.g., they go everywhere)
* minimize the need to bind or reference `this`
* may actually be multimethods or polymorphic protocols

That last deserves some explanation.  The true nature of a function may be unknown.  It may be a function, or a multimethod, or one operation for some protocol.  Take "function," wherever it appears, to potentially be any of these.  This makes all of them first class and interchangeable.

## Guidance for writing functions

Some additional considerations for functions are they:

* can take `self` as a parameter (usually the first) as an alternative to `this`
* should use recursion sparingly due to the potential for a stack overflow
* can be overloaded (via `overload`)
* are the preferred means to instantiating objects (thus `new` will usually be hidden from view)

## Instantiating objects
Atomic prefers constructor functions over class syntax.  While thought was given to rewriting types using class syntax once the feature entered the language, a problem soon became apparent.

A type implemented as a class would more sensibly implement its behavior using methods.  And to permit those types to operate within a primarily functional paradigm, those methods (not being first class) would have to also be bound to functions.  This would introduce a layer of indirection, add overhead, and degrade performance.

This is unfortunate because classes introduce truly private properties, a prerequisite to proper encapsulation.  But before this possibility came into being, the standard had already been to declare all properties publicly and, as a rule, treat them as private.  So there's no need to underscore prefix a property (e.g. `_fname`) since even `fname` should be considered private.

That's still the rule.  Properties, with the exception of those on plain objects, which are themselves treated as DTOs, are accessed/updated via functions.

The strategy for birthing objects remains:

* Don't call a constructor function directly
* Call factory functions instead to birth objects
* Make properties public but treat them as private
* Define an object's api using functions

## Implementing abstract behaviors
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

Due to these rules, a module consumer won't generally use the `new` keyword.  Furthermore, providing overloaded or even alternative factory functions, there can be numerous abstract ways for creating instances of a type.

Never do work in a constructor function.  Save it for the factory function.  See how `Journal` (above) does nothing but assign its arguments to its properties.

```javascript
//implementing protocols to define a behavior...
const behave =
  does(
    implement(IDeref, {deref}),
    implement(IFunctor, {fmap}),
    implement(IRevertible, {undo, redo, ...}));

//...and applying it to a constructor.
behave(Journal);
```
Having this behavior readily applicable as a function is useful for [cross-realm patching](./cross-realm-operatility.md).  If not for this potential need, the behavior might've been directly applied to the constructor.

```javascript
//direct application
doto(Journal,
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}),
  implement(IRevertible, {undo, redo, ...}));
```

## Implementing concrete behaviors
Some types have concrete functions.  A concrete function, the perfect candidate for an actual method, is something which applies to a single known type.

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

The distinction between concrete and abstract functions is this.  A concrete function has a single known type.  An abstract function, also known as a protocol, has an indefinite number of known types.

