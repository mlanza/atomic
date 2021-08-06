# Core

## Cross-frame operability

Most libraries don't work across frames due to each having its own copy of the host's constructors.  This renders certain coding practices (relying on `instanceof` or constructor comparisons) unreliable.

See:
* https://github.com/mrdoob/three.js/issues/5886
* http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/

To work around the issue Atomic applies symbolic names to constructors.  These same names can be applied to constructors in other frames.  Doing this guarantees identical constructors (from different frames) share a common identity.  This enables `is` and `ako` (while `CROSSFRAME=1`) to umambiguously identify objects.

Third-party code including most polyfills (even natives) should be considered unreliable as there is no consistent means by which developers have tackled cross-frame operability.  Only fully-controlled code with no external dependencies (unknowns) can be trusted!

Set `CROSSFRAME=1` to compile cross-frame operable bundles and `CROSSFRAME=0` when not needed as this option is not cost free.

### Fostering Cross-Frame Module Use

* Don't use `instanceof`.  Use `ako`.
* Don't check constructors.  Use `is`.
* Don't bake environment globals (e.g. `document`, `location`) into functions or, at least, provide an overload which allows defaults to be overridden.
* Type checking functions (`isString(s)`, `isElement(e)`, etc.) should be built from `is` or `ako`.
* Export behaviors.  Apply the behaviors and names (e.g. `naming`) into foreign environments which share the library.
* Unless frequently used, don't create type-testing functions such as `isThing(t)`.  Prefer `is(obj, Thing)`.

## Extending Foreign Hosts

Behaviors can be assigned to types if foreign hosts so they understand a module's protocols.  Each module exports a `behave` function which imbues behavior to an environment.

```javascript
import * as core from "atomic/core";
import * as dom from "atomic/dom";

core.behave(window);
core.behave({Array, Object});
dom.behave(window); //includes all known types
dom.behave({Window, Location, HTMLDocument}); //includes only specified types
```
Behaviors (and names) are automatically imbued in the frame in which a module loads.  It is only necessary to manually imbue behaviors to any foreign frames which interact (send data to) with the current.
