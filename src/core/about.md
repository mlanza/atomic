# Core

## Cross-frame operability

Most libraries don't work across iframes precisely because every environment is unique all the way down to its classes.  This breaks `instanceof` when used across frames.

See https://github.com/mrdoob/three.js/issues/5886 and http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/.

To work around the issue `naming` was provided.  This functions assigns symbolic names to behaviors.  The behaviors can be exported and even applied to cross-frame classes.  This guarantees classes spanning environments share common symbolic names.

This enables `what` to umambiguously and consistently identify an object by a fixed, symbolic name.  It should be preferred (e.g. `what(s, String)`, `what(e, Element)`, `what(d, HTMLDocument)`) to type checking functions which rely internally on `instanceof` (e.g. `isString(s)`, `isElement(e)`, `isHTMLDocument(d)`, etc.).

Unfortuately, this approach works only where `instanceof` has been eradicated.  Who's to say whether dependencies, polyfills and even host natives are using the nefarious `instanceof`!?  A set of functions whose dependencies are untainted can indeed operate cleanly across frames.  Test well.

### Fostering Cross-Frame Module Use

* Don't use `instanceof` (e.g. `isElement`).
* Don't compare constructors to classes.
* Don't bake environment globals (e.g. `document`, `location`) into functions or, at least, provide an overload which allows defaults to be overridden.
* Export behaviors.  Apply the behaviors and names (e.g. `naming`) into foreign environments which share the library.

## Extending Foreign Hosts

Behaviors can be assigned to types if foreign hosts so they understand a module's protocols.  Each module exports a `behave` function which imparts behaviors.

```javascript
import * as dom from "atomic/dom";
import * as core from "atomic/core";

dom.behave(window); //includes all known types
dom.behave({Window, Location, HTMLDocument}); //includes only specified types
core.behave(window);
core.behave({Array, Object});
```
Behaviors are automatically applied in the context in which a module is loaded.  It is only necessary to impart behaviors in foreign frames/hosts if cross-frame operability is desired.  As mentioned, one must be vigilant about using only functions untainted by practices that break cross-frame operability.
