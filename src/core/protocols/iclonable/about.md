# Clonable

Makes a copy of an object, usually because the copy will be immediately modified.

In JavaScript land arrays and objects are mutable values.  In Atomic land they are treated as immutable values because no provided operation will, as a rule, mutate them.  In theory, one could implement `clone` on an array using `identity` and while it would work it defeats the purpose.  If an array (or object) is being cloned its to be modified.