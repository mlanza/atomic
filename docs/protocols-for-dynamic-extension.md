# Protocols: dynamic extension done right
The problem of getting types you don't control to do what you want them to is age old.  And it's one developers still struggle to overcome.

There have been popular libraries over the years which, displeased with the lack of features on natives, chose to extend them despite known concerns with the practice.

This problem is not limited to natives.  Third-party libraries are routinely imported to provided types/features an app needs.  Invariably, the added types are 95% complete/correct for the app's requirements.  And, as usual, the temptation to patch them wells up given the cost of building a 100% replacement for what's already 95% right.

While it's possible, with care, to successfully [patch types you don't own](https://en.wikipedia.org/wiki/Monkey_patch), it's never been 100% safe.

Enter protocols.

They're underappreciated in the JS community, namely, because apart from libraries like Atomic, they don't exist in JS.  But the problem of wanting to safely, dynamically extend natives and/or third-party types is a solved problem.  That is, protocols ([of the Clojure variety](https://clojure.org/reference/protocols)) are the solution.

The reason, in case it wasn't obvious, deals with the difference between methods and functions.

Methods, you know, are attached to the types they operate against.  Functions exist independent of any attachment, same as protocols.  That is, protocols exist in a plane of the their own over and above the types against which they operate.

If you're trying to implement a more appropriate version of `splice` for an Array, for example, you're competing for real estate since methods take residence on a prototype.

```javascript
const _slice = Array.prototype.slice;
function slice(...args){
  if (...) { //an exceptional condition
    /* some deviant behavior */
  } else {
    return _slice.call(this, ...args);
  }
}
Array.prototype.slice = slice; //patched!
```
That a method takes a foothold on a prototype is the reason this is dangerous.  Once a new method moves into the old address, any third-party libs your app uses will, without consent or awareness, be obliged to use the new, modified behavior.

The alternative is to move the behavior to a new address.  But no matter what you call it, this is awkard since you mean for it to fully replace the original implementation insomuchas your app is concerned.

```javascript
function slice(...args){
  /* modified implementation */
}
Array.prototype.altSlice = slice; //take up residence elsewhere
```
This makes no sense.  Once you realize you have to change every reference in your app from `slice` to `altSlice` anyway, you see you might as well write a function to do the job.

The fight for residence is a problem functions and protocols don't suffer.  That's because they exists independent of types and prototypes.

Let's rewind.

You wanted some variation of sliceability.  Had there been a known `ISliceable` protocol, presumably defined by the standard JS library or by a third-party library, you wouldn't have to touch it.  Leave it be.

```javascript
// ./libs/natives.js
export const slice = ISliceable.slice;
```
Instead, you create another protocol, since this is a new behavior altogether.  It doesn't matter what you name it.  The fact it was declared in and exported from another modules makes it something else.  Name it `ISliceable` and `slice`, same as the original, if you like, because you mean it to be a drop in replacement for your app.

```javascript
// ./libs/mystuff.js
export const slice = ISliceable.slice; //with a new behavior for type Array
```
```javascript
// ./libs/app.js
//import {slice} from "./natives.js"; -- oh, so yesterday
import {slice} from "./mystuff.js"; //drop in replacement

/* line 397 */
const xs = [...];
const ys = slice(xs, 5, 7); //the `mystuff`, not `natives` behavior!

/* some variation of this repeats at line 490, 525, 1091, etc. */
```
Protocols dodge the name collision issue altogether because they're not vying for a foothold anywhere.

They also guarantee a drop-in replacement couldn't possibly harm a third-party library.  The original `ISliceable` protocol and its `slice` export exist unscathed in their original module.  This is, again, because protocols, like functions, exist outside of the types they operate against.

Atomic takes full advantage of this in its `core` and `shell` libraries.  Both libraries define `ICollection.conj` and `IAssociative.assoc`.  Both the protocol objects and their exported functions share identical names.  This makes it possible to safely import both into a module and chose when to use one or the other.  Same name, different identity.  Just like there's probably more than one Jonathan Smith in the world.

```javascript
import _ from "./libs/atomic_/core.js";
import $ from "./libs/atomic_/shell.js";

const stars = [];
const suits =
  _.chain(stars,
    _.conj(_, "Gabriel Macht"), //simulating `conj`
    _.conj(_, "Patrick J. Adams"));
$.log(stars); //=> [], untouched
$.log(suits); //=> ["Gabriel Macht", "Patrick J. Adams"]

const actors = [];
$.conj(actors, "Gabriel Macht"); //actuating `conj`
$.conj(actors, "Patrick J. Adams");
$.log(actors); //=> ["Gabriel Macht", "Patrick J. Adams"]
```
And although `_.conj` and `$.conj` are closely related, and perhaps deserve to share a name, they're fundamentally different.  [One simulates, the other actuates](./command-query-protocols.md).  Atomic has a slew of same-named protocols sitting on either side of the purity dividing line.
