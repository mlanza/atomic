# Clonable

Makes a copy of an object, usually for immediate modification.

* `clone(self)` - Returns a shallow copy of an object.

In JavaScript land arrays and objects are mutable values.  In Atomic land they are treated as immutable values because no provided operation will, as a rule, mutate them.  Although `identity` provides a working implemention for `clone` it's self defeating.  Cloning signals mutations are coming.

It may not be necessary to clone inner objects.
