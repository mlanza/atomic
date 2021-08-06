# Core

## Cross-frame operability

Most libraries don't work across iframes precisely because every environment is unique all the way down to its classes.  This breaks `instanceof` when used across frames.

See https://github.com/mrdoob/three.js/issues/5886 and http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/.

To work around the issue `naming` was provided.  This functions assigns symbolic names to behaviors.  The behaviors can be exported and even applied to cross-frame classes.  This guarantees classes spanning environments share common symbolic names.

This enables `is` and `ako` (while `CROSSFRAME=1` to umambiguously and consistently identify an object by a fixed, symbolic name if one was assigned and its textual name if not.  While assigning symbolic names is preferred, textual names are extremely reliable.  The only potential issue would result from name collisions (e.g. types that share a name).  Symbolic names overcome this problem.

Third-party code including most polyfills (even natives) should be considered unreliable as there is no consistent means by which developers are tackling cross-frame operability.  Only fully-controlled code with no external dependencies (unknowns) can be trusted.  If third-party dependencies (unknown code!!) are used, test well!

Set `CROSSFRAME=1` to compile cross-frame operable bundles and `CROSSFRAME=0` when not needed as this option is not free of cost.

### Fostering Cross-Frame Module Use

* Don't use `instanceof`.  Use `ako`.
* Don't check constructors.  Use `is`.
* Don't bake environment globals (e.g. `document`, `location`) into functions or, at least, provide an overload which allows defaults to be overridden.
* Type checking functions (`isString(s)`, `isElement(e)`, etc.) should be built from `is` or `ako`.
* Export behaviors.  Apply the behaviors and names (e.g. `naming`) into foreign environments which share the library.
* Don't create a type-testing function such as `isThing(t)` where `is(t, Thing)` will do unless further tests are needed.  An exception has been made for common types (`isObject`, `isArray`, etc.).

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
