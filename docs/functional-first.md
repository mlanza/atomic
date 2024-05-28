# The impact of functional first on birthing objects

Because Atomic is functional first, functions are preferred to methods.  Functions take an implicit subject, usually passed as the first argument, where methods omit the subject in favor of referencing `this`.  Also, they compose better!

Even its constructors are predominantly plain functions.  And while classes have since entered the language spec, they're not used much.  While thought was given to rewriting types using class syntax, a problem soon became apparent.  Creating functions from unbound methods (in order to use classes under the hood) introduces a layer of indirection and overhead which degrades performance.

This is unfortunate because classes provide truly private properties, a necessary prerequisite to encapsulation since only methods owned by the instance can access these properties.  And, as stated, there's overhead to having a function call a method.

Besides, encapsulation has long been achieved through the discipline of using public functions (the contracted, public api) to access and operate against internal data.  Properties have always been declared publicly, even if they were never meant for public consumption.  And, although it would be possible to use symbols as a means to keeping instance data truly private, doing so would be syntactically and aesthetically clunky.

Thus, the strategy for birthing objects remains:

* Create constructor functions but treat them as private (do no real work here)
* Make all properties public but treat them as private
* Define the public api using functions (or protocols, another flavor of functions)
* Create one or more factory functions for instantiating types using the private constructors (do real work here)
